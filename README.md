# Text Composer for Obsidian

## Description
Text Composer is a powerful Obsidian plugin that allows you to compile multiple markdown documents into a single file. It seamlessly integrates content from linked documents using the `![[link_to_document]]` syntax, preserving the structure and hierarchy of your notes.

## Benefits and Why to Use It
- **Streamlined Note Compilation**: Easily merge multiple linked documents into one comprehensive markdown file.
- **Recursive Linking**: Handles nested links efficiently, ensuring all referenced content is included.
- **Non-Intrusive**: Creates a new compiled document, leaving your original notes unchanged.
- **Time-Saving**: Automates the process of gathering content from multiple documents, enhancing productivity.

## Features
- **Recursive Content Compilation**: Automatically includes content from nested linked documents.
- **Non-Destructive**: Generates a new markdown file with the compiled content.
- **User-Friendly Commands**: Easily trigger the compilation process using Obsidian’s command palette.
- **Customizable Settings**: Configure plugin settings to suit your workflow.

## How to Use It
1. **Install the Plugin**:
   - Ensure the plugin is installed and enabled in Obsidian. Navigate to **Settings** → **Community plugins** → **Text Composer** and enable it.

2. **Prepare Your Documents**:
   - Create a main markdown document with links to other documents using the `![[link_to_document]]` syntax.

3. **Compile the Document**:
   - Open the main markdown document in Obsidian.
   - Press `Ctrl + P` (or `Cmd + P` on macOS) to open the command palette.
   - Type `Compile MD Document` and select the command.
   - A new markdown file with the `_compiled.md` suffix will be created, containing the compiled content.

4. **Example**:
   - **Main Document (`main_document.md`)**:
     ```markdown
     # Main Document
     Lorem ipsum...
     ![[nested_document_a]]
     ...dolor sit amet...
     ![[nested_document_b]]
     ...the end of the document.
     ```
   - **Nested Document A (`nested_document_a.md`)**:
     ```markdown
     ## Nested Document A
     Content from nested document A.
     ```
   - **Nested Document B (`nested_document_b.md`)**:
     ```markdown
     ## Nested Document B
     Content from nested document B.
     ```

   - After running the "Compile MD Document" command, a new file `main_document_compiled.md` will be created with the merged content.

## Conclusion
Text Composer for Obsidian is a must-have tool for users who need to consolidate their notes into a single document efficiently. By automating the integration of linked documents, it saves time and enhances productivity, making it an essential plugin for your Obsidian workflow.
