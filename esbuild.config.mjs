import { build } from 'esbuild';

const isDev = process.argv.includes('--watch');

const config = {
  entryPoints: ['main.ts'],
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
  platform: 'node',
  external: ['obsidian'],
};

if (isDev) {
  build({
    ...config,
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else console.log('watch build succeeded:', result);
      },
    },
  }).then(result => {
    console.log('watch build succeeded:', result);
  }).catch(() => process.exit(1));
} else {
  build(config).catch(() => process.exit(1));
}
