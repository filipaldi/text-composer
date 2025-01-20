# Text Composer for Obsidian

## Description
When working with a larger text project, it is a good idea to split the text into smaller chunks - modules – for easier editing and maintenance. The native syntax for embedding files `![[link_to_document.md]]]` allows the text to split into smaller documents and preview the document as complete.
Text Composer does the final job of compiling such embedded documents into a new single file. Easy!


## How it works
The plugin will recursively insert content of all linked documents into the compiled document.
You can choose where to save the compiled document:
- Default Directory: Uses the configured export directory in settings
- Same Directory: Saves alongside the source document
- Custom Directory: Lets you choose a directory each time you compile

## How to Use It
1. **Install the Plugin**:
   - Ensure the plugin is installed and enabled in Obsidian. Navigate to **Settings** → **Community plugins** → **Text Composer** and enable it.

2. **Configure Settings**:
   - Go to **Settings** → **Text Composer**
   - Choose your preferred default compilation mode
   - Set the export directory for the default mode
   - Configure other options like file name suffix and verbose mode

3. **Prepare Your Documents**:
   - Create a main markdown document with links to other documents using the `![[link_to_document]]` syntax.

4. **Compile the Document**:
   You have several commands available:
   - `Compile Document`: Uses your default compilation mode
   - `Compile Document (Default Location)`: Always uses the configured export directory
   - `Compile Document (Same Directory)`: Saves alongside the source document
   - `Compile Document (Choose Directory)`: Prompts you to select a directory

   To run any command:
   - Press `Ctrl + P` (or `Cmd + P` on macOS) to open the command palette
   - Type part of the command name and select it

5. **Example**:
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

   - After running any of the compile commands, a new file will be created with the merged content in the selected location.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
