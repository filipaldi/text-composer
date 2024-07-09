"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileDocument = void 0;
const obsidian_1 = require("obsidian");
const parser_1 = require("./parser");
function compileDocument(filePath, app) {
    return __awaiter(this, void 0, void 0, function* () {
        const vault = app.vault;
        const file = vault.getAbstractFileByPath(filePath);
        if (!(file instanceof obsidian_1.TFile)) {
            throw new Error('File not found or not a valid file.');
        }
        const content = yield vault.read(file);
        return compileContent(content, vault);
    });
}
exports.compileDocument = compileDocument;
function compileContent(content, vault, depth = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        if (depth > 10) {
            throw new Error('Maximum recursion depth exceeded.');
        }
        const parsedContent = (0, parser_1.parseDocument)(content);
        let compiledContent = content;
        for (const link of parsedContent.links) {
            const linkedFile = vault.getAbstractFileByPath(link);
            if (linkedFile instanceof obsidian_1.TFile) {
                const linkedContent = yield vault.read(linkedFile);
                const compiledLinkedContent = yield compileContent(linkedContent, vault, depth + 1);
                compiledContent = (0, parser_1.replaceLinks)(compiledContent, link, compiledLinkedContent);
            }
            else {
                throw new Error(`Linked document not found: ${link}`);
            }
        }
        return compiledContent;
    });
}
