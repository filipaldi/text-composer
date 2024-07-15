import { App, Plugin, PluginSettingTab, Setting, MarkdownView, Notice, TFile } from 'obsidian';
import { TextComposerSettings, DEFAULT_SETTINGS, TextComposerSettingTab } from './options';

export default class TextComposerPlugin extends Plugin {
	settings: TextComposerSettings;

	async onload() {
		await this.loadSettings();

		// Add a command to compile the document
		this.addCommand({
			id: 'compile-md-document',
			name: 'Compile MD Document',
			callback: () => this.compileDocument(),
			hotkeys: [{ modifiers: ["Ctrl", "Shift"], key: "C" }] // Default shortcut
		});

		// Add a settings tab
		this.addSettingTab(new TextComposerSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async compileDocument() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice('No active markdown view found');
			return;
		}

		const editor = activeView.editor;
		const content = editor.getValue();
		const compiledContent = await this.replaceLinks(content);

		// Get the current file and generate the new file name
		const currentFile = activeView.file;
		if (currentFile) {
			const newFileName = currentFile.basename + this.settings.appendName + '.md';
			const newFilePath = this.settings.exportDirectory + '/' + newFileName;

			// Create a new file with the compiled content
			const newFile = await this.app.vault.create(newFilePath, compiledContent);

			// Open the new file in a new tab
			const leaf = this.app.workspace.splitActiveLeaf();
			await leaf.openFile(newFile);

			new Notice(`Compiled document created and opened: ${newFilePath}`);
		} else {
			new Notice('No current file found');
		}
	}

	async replaceLinks(content: string): Promise<string> {
		const linkPattern = /!\[\[([^\]]+)\]\]/g;
		let match: RegExpExecArray | null;
		let result = content;

		while ((match = linkPattern.exec(content)) !== null) {
			const linkedFile = match[1];
			const linkedFilePath = this.app.metadataCache.getFirstLinkpathDest(linkedFile, "");
			if (linkedFilePath) {
				const fileContent = await this.app.vault.read(linkedFilePath);
				const compiledContent = await this.replaceLinks(fileContent); // Recursive replacement
				result = result.replace(match[0], compiledContent);
			}
		}
		return result;
	}
}
