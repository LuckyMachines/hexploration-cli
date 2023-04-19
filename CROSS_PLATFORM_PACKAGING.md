CROSS_PLATFORM_PACKAGING.md

# cross platform packaging

turns hexploration .cli into standalone apps for windows, linux, mac

uses pkg from vercel
https://github.com/vercel/pkg

## FIRST

i'm trying to build on windows 10 right now. things will be different on mac. hopefully not too different.

## how to

`npm install -g pkg`

in root folder

`pkg .` (note the dot - that tells it to use the package.json in this directory, which has some adjustments)

## note - updated package.json file

- has a pkg section
- appended "file:" to local repository ../hexploration reference

## note - visibility for ../hexploration folder - local paths issue?

```

> Warning Cannot find module 'hexploration' from 'C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\bin'  in C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\bin\hexploration-cli

```

pkg has issues with the local repository reference. i'm trying to make it visible to the packager as an entry in 'assets' in package.json `pkg`.

if you make it visible in `scripts` section of `pkg` entry in `package.json`, it tries to also package the whole hexploration repository which is... a lot.

possible solutions:

- dont include hexploration repository locally? do that some other way?
- maybe use NCC from vercel to package hexploration and all its dependencies into a single file first. then include that one in scripts for pkg to use.

https://docs.npmjs.com/cli/v9/configuring-npm/package-json?v=true#local-paths

## ESM issue

They must conform to the JS standards of those Node.js versions you target (see Targets), i.e. be already transpiled.

solutions:

- transpile first
  - use esbuild like this comment https://github.com/vercel/pkg/issues/1291#issuecomment-1295792641
    - their command will need adjusting and won't work verbatim.
      - note: we may also need to transpile the /hexploration repository
  - also maybe rollup https://github.com/vercel/pkg/issues/1291#issuecomment-1340392881

## dynamic routes that are causing issues

---

NOTE: "fixed" by adding to 'assets'

- added scripts and settings to pkg `assets` entry in `package.json`

---

const DeploymentSource = require(`${deploymentsFile}`);
const addressesPath = `${process.cwd()}/settings/ContractAddresses.json`;

> Warning Cannot resolve '`${deploymentsFile}`'
> C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\scripts\import-addresses.js
> Dynamic require may fail at run time, because the requested file
> is unknown at compilation time and not included into executable.
> Use a string literal as an argument for 'require', or leave it
> as is and specify the resolved file name in 'scripts' option.
> Warning Cannot resolve 'addressesPath'
> C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\scripts\import-addresses.js
> Dynamic require may fail at run time, because the requested file
> is unknown at compilation time and not included into executable.
> Use a string literal as an argument for 'require', or leave it
> as is and specify the resolved file name in 'scripts' option.

## directory %1 must be distributed with executable as %2

---

FIX: do what it says

1. go to` ~/node_modules/leveldown` and copy the `prebuilds` folder to somewhere else
2. paste the prebuilds folder to ./dist

---

```
James Pollack@DESKTOP-CM33RIV MINGW64 ~/Desktop/luckystuff/hexplore/hexploration-cli (main)
$ pkg .
> pkg@5.8.1
> Targets not specified. Assuming:
node18-linux-x64, node18-macos-x64, node18-win-x64
> Warning Cannot find module 'hexploration' from 'C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\bin'  in C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\bin\hexploration-cli
> Warning Cannot resolve '`${deploymentsFile}`'
C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\scripts\import-addresses.js
Dynamic require may fail at run time, because the requested file
is unknown at compilation time and not included into executable.
Use a string literal as an argument for 'require', or leave it
as is and specify the resolved file name in 'scripts' option.
> Warning Cannot resolve 'addressesPath'
C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\scripts\import-addresses.js
Dynamic require may fail at run time, because the requested file
is unknown at compilation time and not included into executable.
Use a string literal as an argument for 'require', or leave it
as is and specify the resolved file name in 'scripts' option.
> Warning Cannot include directory %1 into executable.
The directory must be distributed with executable as %2.
%1: ..\..\..\..\node_modules\leveldown\prebuilds
%2: path-to-executable/prebuilds
> Warning Cannot include directory %1 into executable.
The directory must be distributed with executable as %2.
%1: ..\..\..\..\node_modules\leveldown\prebuilds
%2: path-to-executable/prebuilds
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/cli.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/main.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/contract.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/provider.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/map.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/phase.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/submit.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/player.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/landingSite.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/queue.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/turn.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/services.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/hexText.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/rustbn.js/lib/index.asm.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/cli.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/main.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/contract.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/provider.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/map.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/phase.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/submit.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/player.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/landingSite.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/queue.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/turn.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/services.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/src/hexText.js
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/rustbn.js/lib/index.asm.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\cli.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\main.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\contract.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\provider.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\map.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\phase.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\submit.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\player.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\landingSite.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\queue.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\turn.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\services.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\src\hexText.js
> Warning Failed to make bytecode node18-x64 for file C:\snapshot\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\node_modules\rustbn.js\lib\index.asm.js
```

## tutorial for pkg

mostly okay, needs some small adjustments

you don't seem to need this part that turns everything into a single file... or maybe you do and i'm doing it wrong...
`npm i -g @vercel/ncc`

https://blog.sivamuthukumar.com/vercel-pkg-nodejs

## possible pipeline

some combination of transpiling, possibly using ncc to get things to a single file, then using pkg to turn it into executables

question: does hexploration repository need to be transpiled also? does it use ESM?

### approach 1 - transpile, ncc, then pkg

hexploration -> transpile w/esbuild -> vercel ncc -> index.js
hexploration-cli -> transpile w/ esbuild -> pkg . -> APPS

### approach 2 - ncc then transpile

hexploration -> vercel ncc -> index.js
hexploration-cli -> transpile w/ esbuild -> pkg . -> APPS

### approach 3 - ncc everything

hexploration -> vercel ncc -> index.js
hexploration-cli -> vercel ncc -> . aka package.json -> pkg -> APPS

## what my dist folder looks like with the prebuilds folder also

James Pollack@DESKTOP-CM33RIV MINGW64 ~/Desktop/luckystuff/hexplore/hexploration-cli (main)
$ git rm --cached -r dist
rm 'dist/hexploration-cli-linux'
rm 'dist/hexploration-cli-macos'
rm 'dist/hexploration-cli-win.exe'
rm 'dist/index.exe'
rm 'dist/index.js'
rm 'dist/prebuilds/android-arm/node.napi.armv7.node'
rm 'dist/prebuilds/android-arm64/node.napi.armv8.node'
rm 'dist/prebuilds/darwin-x64+arm64/node.napi.node'
rm 'dist/prebuilds/linux-arm/node.napi.armv6.node'
rm 'dist/prebuilds/linux-arm/node.napi.armv7.node'
rm 'dist/prebuilds/linux-arm64/node.napi.armv8.node'
rm 'dist/prebuilds/linux-x64/node.napi.glibc.node'
rm 'dist/prebuilds/linux-x64/node.napi.musl.node'
rm 'dist/prebuilds/win32-ia32/node.napi.node'
rm 'dist/prebuilds/win32-x64/node.napi.node'
rm 'dist/prebuilds/win32-x64/node.napi1.node'
rm 'dist/prebuilds/win32-x64/node.napi2.node'
rm 'dist/prebuilds/win32-x64/node.napi3.node'
