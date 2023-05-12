how ppl get pkg to work
https://github.com/vercel/pkg/issues/1291 - basically use esbuild or rollup to convert esm to commonjs and THEN you can use PKG (silly)

esm package that doesn't work with above
https://www.npmjs.com/package/esm

article max used to build cli - where that way of using esm comes from

https://www.twilio.com/blog/how-to-build-a-cli-with-node-js

pkg details tutorials
https://morioh.com/p/53ae5b0b233c

pkg tutorials
https://www.pulumi.com/blog/nodejs-binaries-with-pkg/

alternative packager
https://github.com/leafac/caxa

i had to install electron. then i could use esbuild to transpile.

have more libraries to copy over still but yay!!

```
  "build": "esbuild src/cli.js --bundle --platform=node --outfile=dist/cli.cjs --define:import.meta.url=__dirname --external:electron"

```

```
James Pollack@DESKTOP-CM33RIV MINGW64 ~/Desktop/luckystuff/hexplore/hexploration-cli (cross_platform)
$ pkg .
> pkg@5.8.1
> Targets not specified. Assuming:
  node18-linux-x64, node18-macos-x64, node18-win-x64
> Warning Cannot stat, ENOENT
  C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\path.txt
  The file was required from 'C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs'
> Warning Cannot include directory %1 into executable.
  The directory must be distributed with executable as %2.
  %1: node_modules\electron\dist
  %2: path-to-executable/electron/dist
> Warning Cannot include file %1 into executable.
  The file must be distributed with executable as %2.
  %1: node_modules\sliced\index.js
  %2: path-to-executable/node_modules/sliced/index.js
> Warning Cannot include file %1 into executable.
  The file must be distributed with executable as %2.
  %1: node_modules\deep-defaults\lib\index.js
  %2: path-to-executable/node_modules/deep-defaults/index.js
> Warning Cannot include directory %1 into executable.
  The directory must be distributed with executable as %2.
  %1: node_modules\electron\dist
  %2: path-to-executable/electron/dist
> Warning Cannot include file %1 into executable.
  The file must be distributed with executable as %2.
  %1: node_modules\sliced\index.js
  %2: path-to-executable/node_modules/sliced/index.js
> Warning Cannot include file %1 into executable.
  The file must be distributed with executable as %2.
  %1: node_modules\deep-defaults\lib\index.js
  %2: path-to-executable/node_modules/deep-defaults/index.js
> Warning Cannot include directory %1 into executable.
  The directory must be distributed with executable as %2.
  %1: ..\..\..\..\node_modules\leveldown\prebuilds
  %2: path-to-executable/prebuilds
> Warning Cannot include directory %1 into executable.
  The directory must be distributed with executable as %2.
  %1: ..\..\..\..\node_modules\leveldown\prebuilds
  %2: path-to-executable/prebuilds
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/rustbn.js/lib/index.asm.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/rustbn.js/lib/index.asm.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\node_modules\rustbn.js\lib\index.asm.js
```

\*\*\* current todo:

```
James Pollack@DESKTOP-CM33RIV MINGW64 ~/Desktop/luckystuff/hexplore/hexploration-cli/dist (cross_platform)
$ ./hexploration-cli-win.exe
pkg/prelude/bootstrap.js:1926
      return wrapper.apply(this.exports, args);
                     ^

TypeError: Cannot read properties of undefined (reading 'HEXPLORATION_BOARD')
    at Object.<anonymous> (C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs)
    at Module._compile (pkg/prelude/bootstrap.js:1926:22)
    at Module._extensions..js (node:internal/modules/cjs/loader:1166:10)
    at Module.load (node:internal/modules/cjs/loader:988:32)
    at Module._load (node:internal/modules/cjs/loader:834:12)
    at Function.runMain (pkg/prelude/bootstrap.js:1979:12)
    at node:internal/main/run_main_module:17:47

Node.js v18.5.0
```

note in regards to bin in package.json

can perhaps add multiple ones
"bin": {
"hexploration-cli": "dist/cli.cjs"
},

---

thought: maybe i _didn't_ have to install electron and could have copied it via the assets section of the pkg config in package.json
