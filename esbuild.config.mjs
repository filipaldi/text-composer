import { build } from 'esbuild';

const isDev = process.argv.includes('--watch');

const config = {
  entryPoints: ['main.ts'],  // Corrected the path to match the existing project structure
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
  platform: 'node',
  external: ['obsidian'],
  watch: isDev && {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error);
      else console.log('watch build succeeded:', result);
    },
  },
};

build(config).catch(() => process.exit(1));
