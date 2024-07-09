"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLinks = exports.parseDocument = void 0;
function parseDocument(content) {
    const linkRegex = /!\[\[(.*?)\]\]/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }
    return { content, links };
}
exports.parseDocument = parseDocument;
function replaceLinks(content, link, replacement) {
    const linkRegex = new RegExp(`!\\[\\[${link}\\]\\]`, 'g');
    return content.replace(linkRegex, replacement);
}
exports.replaceLinks = replaceLinks;
