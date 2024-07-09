#!/bin/bash

# Check if the Obsidian Vault path is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh <path_to_obsidian_vault>"
  exit 1
fi

VAULT_PATH=$1
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/obsidian-md-compiler"

# Build the project
echo "Building the project..."
npm run build

# Create the plugin directory if it doesn't exist
echo "Creating plugin directory at $PLUGIN_DIR"
mkdir -p "$PLUGIN_DIR"

# Copy the built files to the Obsidian plugin directory
echo "Copying files to $PLUGIN_DIR"
cp -r dist/* "$PLUGIN_DIR"
cp manifest.json "$PLUGIN_DIR"

echo "Deployment complete. Enable the plugin in Obsidian to use it."
