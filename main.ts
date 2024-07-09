import { App, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';

interface TextComposerSettings {
	defaultSetting: string;
}

const DEFAULT_SETTINGS: TextComposerSettings = {
	defaultSetting: 'default'
}

export default class TextComposerPlugin extends Plugin {
	settings: TextComposerSettings;

	async onload() {
		await this.loadSettings();

		// Add a command to compile the document
		this.addCommand({
			id: 'compile-md-document',
			name: 'Compile MD Document',
			callback: () => this.compileDocument()
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
		editor.setValue(compiledContent);
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

class TextComposerSettingTab extends PluginSettingTab {
	plugin: TextComposerPlugin;

	constructor(app: App, plugin: TextComposerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Text Composer Settings' });

		new Setting(containerEl)
			.setName('Default Setting')
			.setDesc('A default setting for the plugin')
			.addText(text => text
				.setPlaceholder('Enter your setting')
				.setValue(this.plugin.settings.defaultSetting)
				.onChange(async (value) => {
					this.plugin.settings.defaultSetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
