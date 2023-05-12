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

---

how to compile using ncc

```
 ncc build src/cli.js -o dist2
```

```
 ncc: Version 0.36.1
ncc: Compiling file index.js into CJS
     0kB  dist2\path.txt
     0kB  dist2\dist/vk_swiftshader_icd.json
     0kB  dist2\dist/version
     1kB  dist2\dist/LICENSE
   107kB  dist2\dist/resources/default_app.asar
   124kB  dist2\dist/chrome_100_percent.pak
   146kB  dist2\prebuilds/win32-x64/node.napi3.node
   146kB  dist2\prebuilds/win32-x64/node.napi2.node
   173kB  dist2\dist/chrome_200_percent.pak
   180kB  dist2\prebuilds/win32-x64/node.napi.node
   267kB  dist2\dist/snapshot_blob.bin
   276kB  dist2\prebuilds/win32-x64/node.napi1.node
   337kB  dist2\dist/locales/en-GB.pak
   339kB  dist2\dist/locales/en-US.pak
   342kB  dist2\dist/locales/zh-TW.pak
   346kB  dist2\dist/locales/zh-CN.pak
   365kB  dist2\dist/locales/id.pak
   369kB  dist2\dist/locales/af.pak
   372kB  dist2\dist/locales/et.pak
   374kB  dist2\dist/locales/nb.pak
   376kB  dist2\dist/locales/sv.pak
   380kB  dist2\dist/locales/fi.pak
   381kB  dist2\dist/locales/ms.pak
   386kB  dist2\dist/locales/nl.pak
   387kB  dist2\dist/locales/da.pak
   395kB  dist2\dist/locales/sw.pak
   402kB  dist2\dist/locales/tr.pak
   405kB  dist2\dist/locales/it.pak
   406kB  dist2\dist/locales/pt-BR.pak
   407kB  dist2\dist/locales/pt-PT.pak
   411kB  dist2\dist/locales/es.pak
   411kB  dist2\dist/locales/es-419.pak
   414kB  dist2\dist/locales/hr.pak
   414kB  dist2\dist/locales/de.pak
   416kB  dist2\dist/locales/ko.pak
   417kB  dist2\dist/locales/ca.pak
   418kB  dist2\dist/locales/sl.pak
   420kB  dist2\dist/locales/ro.pak
   426kB  dist2\dist/locales/cs.pak
   428kB  dist2\dist/locales/fil.pak
   430kB  dist2\dist/locales/pl.pak
   433kB  dist2\dist/locales/sk.pak
   444kB  dist2\dist/locales/fr.pak
   445kB  dist2\dist/locales/lv.pak
   446kB  dist2\dist/locales/hu.pak
   447kB  dist2\dist/locales/lt.pak
   470kB  dist2\dist/libEGL.dll
   477kB  dist2\dist/locales/vi.pak
   493kB  dist2\dist/locales/ja.pak
   531kB  dist2\dist/locales/he.pak
   574kB  dist2\dist/v8_context_snapshot.bin
   599kB  dist2\dist/locales/am.pak
   603kB  dist2\dist/locales/ur.pak
   608kB  dist2\dist/locales/fa.pak
   645kB  dist2\dist/locales/sr.pak
   655kB  dist2\dist/locales/ar.pak
   685kB  dist2\dist/locales/bg.pak
   687kB  dist2\dist/locales/ru.pak
   689kB  dist2\dist/locales/uk.pak
   751kB  dist2\dist/locales/el.pak
   793kB  dist2\dist/locales/th.pak
   844kB  dist2\dist/locales/mr.pak
   859kB  dist2\dist/locales/gu.pak
   884kB  dist2\dist/locales/bn.pak
   900kB  dist2\dist/locales/hi.pak
   907kB  dist2\dist/vulkan-1.dll
   943kB  dist2\dist/locales/te.pak
   989kB  dist2\dist/locales/kn.pak
  1019kB  dist2\dist/locales/ta.pak
  1032kB  dist2\dist/locales/ml.pak
  2815kB  dist2\dist/ffmpeg.dll
  4801kB  dist2\dist/d3dcompiler_47.dll
  5123kB  dist2\dist/resources.pak
  5210kB  dist2\dist/vk_swiftshader.dll
  7447kB  dist2\dist/libGLESv2.dll
  8118kB  dist2\dist/LICENSES.chromium.html
  8706kB  dist2\index.js
 10298kB  dist2\dist/icudtl.dat
158322kB  dist2\dist/electron.exe
243486kB  [2566ms] - ncc 0.36.1
```

then package it this way with pkg after ncc

```
pkg dist2/index.js --out-path dist3
```

slightly different build errors but the exact same runtime error as doing it with esbuild

compile time

````$ pkg dist2/index.js --out-path dist3
> pkg@5.8.1
> Targets not specified. Assuming:
  node18-linux-x64, node18-macos-x64, node18-win-x64
> Warning Cannot resolve '__nccwpck_require__.ab + "prebuilds/win32-x64/node.napi1.node"'
  C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js
  Dynamic require may fail at run time, because the requested file
  is unknown at compilation time and not included into executable.
  Use a string literal as an argument for 'require', or leave it
  as is and specify the resolved file name in 'scripts' option.
> Warning Cannot resolve '__nccwpck_require__.ab + "prebuilds/win32-x64/node.napi.node"'
  C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js
  Dynamic require may fail at run time, because the requested file
  is unknown at compilation time and not included into executable.
  Use a string literal as an argument for 'require', or leave it
  as is and specify the resolved file name in 'scripts' option.```


https://github.com/vercel/pkg/discussions/1627

runtime
```$ ./dist3/index-win.exe
pkg/prelude/bootstrap.js:1926
      return wrapper.apply(this.exports, args);
                     ^

TypeError: Cannot read properties of undefined (reading 'HEXPLORATION_BOARD')
    at 518 (C:\snapshot\dist2\index.js)
    at __nccwpck_require__ (C:\snapshot\dist2\index.js)
    at C:\snapshot\dist2\index.js
    at Object.<anonymous> (C:\snapshot\dist2\index.js)
    at Module._compile (pkg/prelude/bootstrap.js:1926:22)
    at Module._extensions..js (node:internal/modules/cjs/loader:1166:10)
    at Module.load (node:internal/modules/cjs/loader:988:32)
    at Module._load (node:internal/modules/cjs/loader:834:12)
    at Function.runMain (pkg/prelude/bootstrap.js:1979:12)
    at node:internal/main/run_main_module:17:47

````
