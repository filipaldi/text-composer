export interface ParsedDocument {
    content: string;
    links: string[];
}

export function parseDocument(content: string): ParsedDocument {
    const linkRegex = /!\[\[(.*?)\]\]/g;
    const links: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }

    return { content, links };
}

export function replaceLinks(content: string, link: string, replacement: string): string {
    const linkRegex = new RegExp(`!\\[\\[${link}\\]\\]`, 'g');
    return content.replace(linkRegex, replacement);
}
