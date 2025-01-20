var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TextComposerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// options.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  exportDirectory: "/",
  appendName: "_compiled",
  shortcut: "Ctrl+Shift+C",
  verboseMode: false,
  defaultCompilationMode: "default_directory" /* DEFAULT_DIRECTORY */
};
var TextComposerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Text Composer Settings" });
    new import_obsidian.Setting(containerEl).setName("Default Compilation Mode").setDesc("Choose the default behavior for document compilation").addDropdown((dropdown) => dropdown.addOption("default_directory" /* DEFAULT_DIRECTORY */, "Use Export Directory").addOption("same_directory" /* SAME_DIRECTORY */, "Same as Source").addOption("custom_directory" /* CUSTOM_DIRECTORY */, "Custom Directory").setValue(this.plugin.settings.defaultCompilationMode).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.defaultCompilationMode = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Export Directory").setDesc("Set the directory where the compiled file will be exported when using Default Directory mode").addText((text) => text.setPlaceholder("Enter export directory").setValue(this.plugin.settings.exportDirectory).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.exportDirectory = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Append Name").setDesc("Set the name to append to the compiled file").addText((text) => text.setPlaceholder("Enter append name").setValue(this.plugin.settings.appendName).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.appendName = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Shortcut").setDesc("Set the shortcut to run the plugin").addText((text) => text.setPlaceholder("Enter shortcut").setValue(this.plugin.settings.shortcut).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.shortcut = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Verbose Mode").setDesc("Show detailed information during compilation").addToggle((toggle) => toggle.setValue(this.plugin.settings.verboseMode).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.verboseMode = value;
      yield this.plugin.saveSettings();
    })));
  }
};

// main.ts
var TextComposerPlugin = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addCommand({
        id: "compile-md-document-default",
        name: "Compile Document (Default Location)",
        callback: () => this.compileDocument("default_directory" /* DEFAULT_DIRECTORY */)
      });
      this.addCommand({
        id: "compile-md-document-same",
        name: "Compile Document (Same Directory)",
        callback: () => this.compileDocument("same_directory" /* SAME_DIRECTORY */)
      });
      this.addCommand({
        id: "compile-md-document-custom",
        name: "Compile Document (Choose Directory)",
        callback: () => this.compileDocument("custom_directory" /* CUSTOM_DIRECTORY */)
      });
      this.addCommand({
        id: "compile-md-document",
        name: "Compile Document",
        callback: () => this.compileDocument(this.settings.defaultCompilationMode)
      });
      this.addSettingTab(new TextComposerSettingTab(this.app, this));
    });
  }
  onunload() {
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
  getTargetDirectory(mode, sourceFile) {
    return __async(this, null, function* () {
      var _a;
      switch (mode) {
        case "default_directory" /* DEFAULT_DIRECTORY */:
          return this.settings.exportDirectory;
        case "same_directory" /* SAME_DIRECTORY */:
          return ((_a = sourceFile.parent) == null ? void 0 : _a.path) || "/";
        case "custom_directory" /* CUSTOM_DIRECTORY */:
          const picker = new FolderSelectionModal(this.app);
          const selectedPath = yield picker.waitForClose();
          if (!selectedPath) {
            throw new Error("No directory selected");
          }
          return selectedPath;
        default:
          return this.settings.exportDirectory;
      }
    });
  }
  compileDocument() {
    return __async(this, arguments, function* (mode = "default_directory" /* DEFAULT_DIRECTORY */) {
      var _a;
      const activeView = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
      if (!activeView) {
        new import_obsidian2.Notice("No active markdown view found");
        return;
      }
      const editor = activeView.editor;
      const content = editor.getValue();
      if (this.settings.verboseMode) {
        new import_obsidian2.Notice(`Starting compilation of: ${(_a = activeView.file) == null ? void 0 : _a.basename}`);
      }
      const compiledContent = yield this.replaceLinks(content);
      const currentFile = activeView.file;
      if (currentFile) {
        try {
          const targetDirectory = yield this.getTargetDirectory(mode, currentFile);
          const newFileName = currentFile.basename + this.settings.appendName + ".md";
          const newFilePath = targetDirectory + "/" + newFileName;
          if (this.settings.verboseMode) {
            new import_obsidian2.Notice(`Export location: ${targetDirectory}`);
            new import_obsidian2.Notice(`Output filename: ${newFileName}`);
          }
          if (!(yield this.app.vault.adapter.exists(targetDirectory))) {
            yield this.app.vault.createFolder(targetDirectory);
            if (this.settings.verboseMode) {
              new import_obsidian2.Notice(`Created export directory: ${targetDirectory}`);
            }
          }
          const fileExists = yield this.app.vault.adapter.exists(newFilePath);
          let compiledFile;
          if (fileExists) {
            if (this.settings.verboseMode) {
              new import_obsidian2.Notice(`Found existing file at: ${newFilePath}`);
              new import_obsidian2.Notice("Overwriting existing file...");
            }
            yield this.app.vault.adapter.remove(newFilePath);
            compiledFile = yield this.app.vault.create(newFilePath, compiledContent);
            new import_obsidian2.Notice(`\u2713 File updated: ${newFileName}`);
          } else {
            if (this.settings.verboseMode) {
              new import_obsidian2.Notice(`No existing file found at: ${newFilePath}`);
              new import_obsidian2.Notice("Creating new file...");
            }
            compiledFile = yield this.app.vault.create(newFilePath, compiledContent);
            new import_obsidian2.Notice(`\u2713 New file created: ${newFileName}`);
          }
          const leaf = this.app.workspace.splitActiveLeaf();
          yield leaf.openFile(compiledFile);
          if (this.settings.verboseMode) {
            new import_obsidian2.Notice("\u2713 Compilation completed successfully");
          }
        } catch (error) {
          console.error("Error during file operation:", error);
          new import_obsidian2.Notice(`\u274C Error: Could not compile document - ${error.message}`);
        }
      } else {
        new import_obsidian2.Notice("No current file found");
      }
    });
  }
  replaceLinks(content) {
    return __async(this, null, function* () {
      const linkPattern = /!\[\[([^\]]+)\]\]/g;
      let match;
      let result = content;
      let linkCount = 0;
      while ((match = linkPattern.exec(content)) !== null) {
        linkCount++;
        const linkedFile = match[1];
        if (this.settings.verboseMode) {
          new import_obsidian2.Notice(`Processing link ${linkCount}: ${linkedFile}`);
        }
        const linkedFilePath = this.app.metadataCache.getFirstLinkpathDest(linkedFile, "");
        if (linkedFilePath) {
          if (!linkedFilePath.path.toLowerCase().endsWith(".md")) {
            if (this.settings.verboseMode) {
              new import_obsidian2.Notice(`\u26A0\uFE0F Skipping non-markdown file: ${linkedFile}`);
            }
            continue;
          }
          if (this.settings.verboseMode) {
            new import_obsidian2.Notice(`\u2192 Including content from: ${linkedFile}`);
          }
          const fileContent = yield this.app.vault.read(linkedFilePath);
          const compiledContent = yield this.replaceLinks(fileContent);
          result = result.replace(match[0], compiledContent);
        } else if (this.settings.verboseMode) {
          new import_obsidian2.Notice(`\u26A0\uFE0F Warning: Could not resolve link ${linkedFile}`);
        }
      }
      if (this.settings.verboseMode && linkCount > 0) {
        new import_obsidian2.Notice(`\u2713 Processed ${linkCount} links`);
      }
      return result;
    });
  }
};
var FolderSelectionModal = class extends import_obsidian2.Modal {
  constructor(app) {
    super(app);
    this.resolvePromise = null;
    this.selectedPath = null;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Select Target Directory" });
    const folderList = contentEl.createDiv("folder-list");
    const folders = this.getAllFolders();
    folders.forEach((folder) => {
      const folderEl = folderList.createDiv("folder-item");
      folderEl.setText(folder);
      folderEl.addEventListener("click", () => {
        this.selectedPath = folder;
        this.close();
      });
    });
    const cancelButton = contentEl.createEl("button", { text: "Cancel" });
    cancelButton.addEventListener("click", () => {
      this.selectedPath = null;
      this.close();
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    if (this.resolvePromise) {
      this.resolvePromise(this.selectedPath);
    }
  }
  waitForClose() {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      this.open();
    });
  }
  getAllFolders() {
    const folders = ["/"];
    this.app.vault.getAllLoadedFiles().forEach((file) => {
      if (file.parent) {
        const path = file.parent.path;
        if (!folders.includes(path)) {
          folders.push(path);
        }
      }
    });
    return folders.sort();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=main.js.map
