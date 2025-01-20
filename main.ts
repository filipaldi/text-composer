import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';
import { TextComposerSettings, DEFAULT_SETTINGS, CompilationMode, TextComposerSettingTab } from './options';

export default class TextComposerPlugin extends Plugin {
	settings: TextComposerSettings;

	async onload() {
		await this.loadSettings();

		// Add commands for different compilation modes
		this.addCommand({
			id: 'compile-md-document-default',
			name: 'Compile Document (Default Location)',
			callback: () => this.compileDocument(CompilationMode.DEFAULT_DIRECTORY)
		});

		this.addCommand({
			id: 'compile-md-document-same',
			name: 'Compile Document (Same Directory)',
			callback: () => this.compileDocument(CompilationMode.SAME_DIRECTORY)
		});

		this.addCommand({
			id: 'compile-md-document-custom',
			name: 'Compile Document (Choose Directory)',
			callback: () => this.compileDocument(CompilationMode.CUSTOM_DIRECTORY)
		});

		// Legacy command - uses default compilation mode
		this.addCommand({
			id: 'compile-md-document',
			name: 'Compile Document',
			callback: () => this.compileDocument(this.settings.defaultCompilationMode)
		});

		this.addSettingTab(new TextComposerSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async getTargetDirectory(mode: CompilationMode, sourceFile: TFile): Promise<string> {
		switch (mode) {
			case CompilationMode.DEFAULT_DIRECTORY:
				return this.settings.exportDirectory;
			case CompilationMode.SAME_DIRECTORY:
				return sourceFile.parent?.path || '/';
			case CompilationMode.CUSTOM_DIRECTORY:
				// Show folder selection dialog
				const picker = new FolderSelectionModal(this.app);
				const selectedPath = await picker.waitForClose();
				if (!selectedPath) {
					throw new Error('No directory selected');
				}
				return selectedPath;
			default:
				return this.settings.exportDirectory;
		}
	}

	async compileDocument(mode: CompilationMode = CompilationMode.DEFAULT_DIRECTORY) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice('No active markdown view found');
			return;
		}

		const editor = activeView.editor;
		const content = editor.getValue();
		
		if (this.settings.verboseMode) {
			new Notice(`Starting compilation of: ${activeView.file?.basename}`);
		}
		
		const compiledContent = await this.replaceLinks(content);

		const currentFile = activeView.file;
		if (currentFile) {
			try {
				const targetDirectory = await this.getTargetDirectory(mode, currentFile);
				const newFileName = currentFile.basename + this.settings.appendName + '.md';
				const newFilePath = targetDirectory + '/' + newFileName;

				if (this.settings.verboseMode) {
					new Notice(`Export location: ${targetDirectory}`);
					new Notice(`Output filename: ${newFileName}`);
				}

				// Create target directory if it doesn't exist
				if (!(await this.app.vault.adapter.exists(targetDirectory))) {
					await this.app.vault.createFolder(targetDirectory);
					if (this.settings.verboseMode) {
						new Notice(`Created export directory: ${targetDirectory}`);
					}
				}

				// Check if file exists
				const fileExists = await this.app.vault.adapter.exists(newFilePath);
				let compiledFile: TFile;

				if (fileExists) {
					if (this.settings.verboseMode) {
						new Notice(`Found existing file at: ${newFilePath}`);
						new Notice('Overwriting existing file...');
					}
					await this.app.vault.adapter.remove(newFilePath);
					compiledFile = await this.app.vault.create(newFilePath, compiledContent);
					new Notice(`✓ File updated: ${newFileName}`);
				} else {
					if (this.settings.verboseMode) {
						new Notice(`No existing file found at: ${newFilePath}`);
						new Notice('Creating new file...');
					}
					compiledFile = await this.app.vault.create(newFilePath, compiledContent);
					new Notice(`✓ New file created: ${newFileName}`);
				}

				// Open the file in a new tab
				const leaf = this.app.workspace.splitActiveLeaf();
				await leaf.openFile(compiledFile);
				
				if (this.settings.verboseMode) {
					new Notice('✓ Compilation completed successfully');
				}
			} catch (error) {
				console.error('Error during file operation:', error);
				new Notice(`❌ Error: Could not compile document - ${error.message}`);
			}
		} else {
			new Notice('No current file found');
		}
	}

	async replaceLinks(content: string): Promise<string> {
		const linkPattern = /!\[\[([^\]]+)\]\]/g;
		let match: RegExpExecArray | null;
		let result = content;
		let linkCount = 0;

		while ((match = linkPattern.exec(content)) !== null) {
			linkCount++;
			const linkedFile = match[1];
			if (this.settings.verboseMode) {
				new Notice(`Processing link ${linkCount}: ${linkedFile}`);
			}
			
			const linkedFilePath = this.app.metadataCache.getFirstLinkpathDest(linkedFile, "");
			if (linkedFilePath) {
				if (!linkedFilePath.path.toLowerCase().endsWith(".md")) {
					if (this.settings.verboseMode) {
						new Notice(`⚠️ Skipping non-markdown file: ${linkedFile}`);
					}
					continue;
				}
				if (this.settings.verboseMode) {
					new Notice(`→ Including content from: ${linkedFile}`);
				}
				const fileContent = await this.app.vault.read(linkedFilePath);
				const compiledContent = await this.replaceLinks(fileContent);
				result = result.replace(match[0], compiledContent);
			} else if (this.settings.verboseMode) {
				new Notice(`⚠️ Warning: Could not resolve link ${linkedFile}`);
			}
		}

		if (this.settings.verboseMode && linkCount > 0) {
			new Notice(`✓ Processed ${linkCount} links`);
		}

		return result;
	}
}

class FolderSelectionModal extends Modal {
	private resolvePromise: ((value: string | null) => void) | null = null;
	private selectedPath: string | null = null;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		
		contentEl.createEl('h2', { text: 'Select Target Directory' });
		
		const folderList = contentEl.createDiv('folder-list');
		
		// Get all folders in the vault
		const folders = this.getAllFolders();
		folders.forEach(folder => {
			const folderEl = folderList.createDiv('folder-item');
			folderEl.setText(folder);
			folderEl.addEventListener('click', () => {
				this.selectedPath = folder;
				this.close();
			});
		});

		// Add cancel button
		const cancelButton = contentEl.createEl('button', { text: 'Cancel' });
		cancelButton.addEventListener('click', () => {
			this.selectedPath = null;
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		if (this.resolvePromise) {
			this.resolvePromise(this.selectedPath);
		}
	}

	waitForClose(): Promise<string | null> {
		return new Promise((resolve) => {
			this.resolvePromise = resolve;
			this.open();
		});
	}

	private getAllFolders(): string[] {
		const folders: string[] = ['/'];
		this.app.vault.getAllLoadedFiles().forEach(file => {
			if (file.parent) {
				const path = file.parent.path;
				if (!folders.includes(path)) {
					folders.push(path);
				}
			}
		});
		return folders.sort();
	}
}

