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
const obsidian_1 = require("obsidian");
const compiler_1 = require("./compiler");
class MdCompilerPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading MdCompilerPlugin...');
            this.addCommand({
                id: 'compile-md-document',
                name: 'Compile Markdown Document',
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    const activeFile = this.app.workspace.getActiveFile();
                    if (activeFile) {
                        const compiledContent = yield (0, compiler_1.compileDocument)(activeFile.path, this.app);
                        this.app.vault.modify(activeFile, compiledContent);
                    }
                    else {
                        new obsidian_1.Notice('No active markdown file found.');
                    }
                }),
            });
        });
    }
    onunload() {
        console.log('Unloading MdCompilerPlugin...');
    }
}
exports.default = MdCompilerPlugin;
