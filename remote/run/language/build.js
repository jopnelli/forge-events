const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
esbuild.build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    outfile: 'dist/out.js',
    target: "node16",
    platform: "node",
    plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1))
