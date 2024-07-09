"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilationError = void 0;
class CompilationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CompilationError';
    }
}
exports.CompilationError = CompilationError;
