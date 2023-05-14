https://esbuild.github.io/getting-started/#bundling-for-node

```
You also may not want to bundle your dependencies with esbuild. There are many node-specific features that esbuild doesn't support while bundling such as \_\_dirname, import.meta.url, fs.readFileSync, and \*.node native binary modules. You can exclude all of your dependencies from the bundle by setting packages to external:

esbuild app.jsx --bundle --platform=node --packages=external
```
