import { App, PluginSettingTab, Setting } from 'obsidian';
import TextComposerPlugin from './main';

export enum CompilationMode {
	DEFAULT_DIRECTORY = 'default_directory',
	SAME_DIRECTORY = 'same_directory',
	CUSTOM_DIRECTORY = 'custom_directory'
}

export interface TextComposerSettings {
	exportDirectory: string;
	appendName: string;
	shortcut: string;
	verboseMode: boolean;
	defaultCompilationMode: CompilationMode;
}

export const DEFAULT_SETTINGS: TextComposerSettings = {
	exportDirectory: '/',
	appendName: '_compiled',
	shortcut: 'Ctrl+Shift+C',
	verboseMode: false,
	defaultCompilationMode: CompilationMode.DEFAULT_DIRECTORY,
}

export class TextComposerSettingTab extends PluginSettingTab {
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
			.setName('Default Compilation Mode')
			.setDesc('Choose the default behavior for document compilation')
			.addDropdown(dropdown => dropdown
				.addOption(CompilationMode.DEFAULT_DIRECTORY, 'Use Export Directory')
				.addOption(CompilationMode.SAME_DIRECTORY, 'Same as Source')
				.addOption(CompilationMode.CUSTOM_DIRECTORY, 'Custom Directory')
				.setValue(this.plugin.settings.defaultCompilationMode)
				.onChange(async (value: CompilationMode) => {
					this.plugin.settings.defaultCompilationMode = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Export Directory')
			.setDesc('Set the directory where the compiled file will be exported when using Default Directory mode')
			.addText(text => text
				.setPlaceholder('Enter export directory')
				.setValue(this.plugin.settings.exportDirectory)
				.onChange(async (value) => {
					this.plugin.settings.exportDirectory = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Append Name')
			.setDesc('Set the name to append to the compiled file')
			.addText(text => text
				.setPlaceholder('Enter append name')
				.setValue(this.plugin.settings.appendName)
				.onChange(async (value) => {
					this.plugin.settings.appendName = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Shortcut')
			.setDesc('Set the shortcut to run the plugin')
			.addText(text => text
				.setPlaceholder('Enter shortcut')
				.setValue(this.plugin.settings.shortcut)
				.onChange(async (value) => {
					this.plugin.settings.shortcut = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Verbose Mode')
			.setDesc('Show detailed information during compilation')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.verboseMode)
				.onChange(async (value) => {
					this.plugin.settings.verboseMode = value;
					await this.plugin.saveSettings();
				}));
	}
}
