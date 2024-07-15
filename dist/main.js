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
  shortcut: "Ctrl+Shift+C"
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
    new import_obsidian.Setting(containerEl).setName("Export Directory").setDesc("Set the directory where the compiled file will be exported").addText((text) => text.setPlaceholder("Enter export directory").setValue(this.plugin.settings.exportDirectory).onChange((value) => __async(this, null, function* () {
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
  }
};

// main.ts
var TextComposerPlugin = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addCommand({
        id: "compile-md-document",
        name: "Compile MD Document",
        callback: () => this.compileDocument(),
        hotkeys: [{ modifiers: ["Ctrl", "Shift"], key: "C" }]
        // Default shortcut
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
  compileDocument() {
    return __async(this, null, function* () {
      const activeView = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
      if (!activeView) {
        new import_obsidian2.Notice("No active markdown view found");
        return;
      }
      const editor = activeView.editor;
      const content = editor.getValue();
      const compiledContent = yield this.replaceLinks(content);
      const currentFile = activeView.file;
      if (currentFile) {
        const newFileName = currentFile.basename + this.settings.appendName + ".md";
        const newFilePath = this.settings.exportDirectory + "/" + newFileName;
        const newFile = yield this.app.vault.create(newFilePath, compiledContent);
        const leaf = this.app.workspace.splitActiveLeaf();
        yield leaf.openFile(newFile);
        new import_obsidian2.Notice(`Compiled document created and opened: ${newFilePath}`);
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
      while ((match = linkPattern.exec(content)) !== null) {
        const linkedFile = match[1];
        const linkedFilePath = this.app.metadataCache.getFirstLinkpathDest(linkedFile, "");
        if (linkedFilePath) {
          const fileContent = yield this.app.vault.read(linkedFilePath);
          const compiledContent = yield this.replaceLinks(fileContent);
          result = result.replace(match[0], compiledContent);
        }
      }
      return result;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=main.js.map
