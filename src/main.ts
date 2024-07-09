import { Plugin } from 'obsidian';
import { compileDocument } from './compiler';

export default class MdCompilerPlugin extends Plugin {
    async onload() {
        console.log('Loading MdCompilerPlugin...');
        this.addCommand({
            id: 'compile-md-document',
            name: 'Compile Markdown Document',
            callback: async () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile) {
                    const compiledContent = await compileDocument(activeFile.path);
                    this.app.vault.modify(activeFile, compiledContent);
                } else {
                    new Notice('No active markdown file found.');
                }
            },
        });
    }

    onunload() {
        console.log('Unloading MdCompilerPlugin...');
    }
}
