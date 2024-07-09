import { App, Vault } from 'obsidian';
import { parseDocument, replaceLinks } from './parser';

export async function compileDocument(filePath: string, app: App): Promise<string> {
    const vault = app.vault;
    const content = await vault.read(vault.getAbstractFileByPath(filePath));
    return compileContent(content, vault);
}

async function compileContent(content: string, vault: Vault, depth = 0): Promise<string> {
    if (depth > 10) {
        throw new Error('Maximum recursion depth exceeded.');
    }

    const parsedContent = parseDocument(content);
    let compiledContent = content;

    for (const link of parsedContent.links) {
        const linkedFile = vault.getAbstractFileByPath(link);
        if (linkedFile) {
            const linkedContent = await vault.read(linkedFile);
            const compiledLinkedContent = await compileContent(linkedContent, vault, depth + 1);
            compiledContent = replaceLinks(compiledContent, link, compiledLinkedContent);
        } else {
            throw new Error(`Linked document not found: ${link}`);
        }
    }

    return compiledContent;
}
