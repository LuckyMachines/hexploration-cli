https://esbuild.github.io/getting-started/#bundling-for-node

```
You also may not want to bundle your dependencies with esbuild. There are many node-specific features that esbuild doesn't support while bundling such as \_\_dirname, import.meta.url, fs.readFileSync, and \*.node native binary modules. You can exclude all of your dependencies from the bundle by setting packages to external:

esbuild app.jsx --bundle --platform=node --packages=external
```

put the contents of .env file and the private key into the code in plain text because its struggling with a file system (PATH) stuff.

now its working at the NCC /dist2 level
still not working with pkg /dist3

error in this package
https://www.npmjs.com/package/js-sha3

TypeError: object is not a constructor
at new Keccak (C:\snapshot\dist2\index.js)
at C:\snapshot\dist2\index.js
at C:\snapshot\dist2\index.js
at C:\snapshot\dist2\index.js
at keccak (C:\snapshot\dist2\index.js)
at pubToAddress (C:\snapshot\dist2\index.js)
at Wallet.getAddress (C:\snapshot\dist2\index.js)
at Wallet.getAddressString (C:\snapshot\dist2\index.js)
at HDWalletProvider.ethUtilValidation (C:\snapshot\dist2\index.js)
at new HDWalletProvider (C:\snapshot\dist2\index.js)
at provider (C:\snapshot\dist2\index.js)
at cli (C:\snapshot\dist2\index.js)
at C:\snapshot\dist2\index.js
at C:\snapshot\dist2\index.js
at Object.<anonymous> (C:\snapshot\dist2\index.js)
at Module.\_compile (pkg/prelude/bootstrap.js:1926:22)

truffle/hdwallet-provider keccak is not a constructor

setup provider as HDWalletProvider undefined
walletOptions {
privateKeys: [
'efab1d8aee4198c8f938eab2cef50301f15bb10903794e11fce5006cee976843'
],
providerOrUrl: 'https://v1.testnet.godwoken.io/rpc'
}
error at new HDWalletProvider
TypeError: object is not a constructor
at new Keccak (C:\snapshot\dist2\index.js)
at C:\snapshot\dist2\index.js
at C:\snapshot\dist2\index.js
at C:\snapshot\dist2\index.js
at keccak (C:\snapshot\dist2\index.js)
at pubToAddress (C:\snapshot\dist2\index.js)
at Wallet.getAddress (C:\snapshot\dist2\index.js)
at Wallet.getAddressString (C:\snapshot\dist2\index.js)
at HDWalletProvider.ethUtilValidation (C:\snapshot\dist2\index.js)
at new HDWalletProvider (C:\snapshot\dist2\index.js)
at provider (C:\snapshot\dist2\index.js)
at cli (C:\snapshot\dist2\index.js)
at C:\snapshot\dist2\index.js
at C:\snapshot\dist2\index.js
at Object.<anonymous> (C:\snapshot\dist2\index.js)
at Module.\_compile (pkg/prelude/bootstrap.js:1926:22)

    for some reason now i just get this stupid crypto error?

    C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:240058
        throw e;
        ^

Error: Cannot find module 'crypto'
at Object.webpackEmptyContext (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:240056:10)
at C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:56260:43
at 41771 (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:56263:3)
at **nccwpck_require** (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:241465:43)
at 21810 (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:56184:17)
at **nccwpck_require** (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:241465:43)
at 82961 (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:56079:18)
at **nccwpck_require** (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:241465:43)
at 61366 (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:50384:20)
at **nccwpck_require** (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist2\index.js:241465:43) {
code: 'MODULE_NOT_FOUND'
}

Node.js v18.16.0

---

5/13/2023
WHOA
it works with ESBUILD now though!!!

idk why it isnt working with NCC anymore. it fails on the 'crypto' module which is a known error

https://github.com/vercel/ncc/issues/985

i've tried requiring crypto (at an old version 0.0.3 when it still was a thing) and crypto-browserify as a shim. the crypto-browserify way maybe went further but still there was a KeccakState not a constructor error when i did that.

5/14
golden path for now

```
npm run build
```

```
pkg .
```

and then you can run the file in dist-pkg

NOTES:

minification does seem to work fine... but it made the end result with pkg BIGGER!

```

    "build": "esbuild src/cli.js --bundle --platform=node --outfile=dist/cli.cjs --define:import.meta.url=__dirname --minify"
```

pkg version

```
pkg --version
5.8.1
```

some warnings that print as errors when we use --debug option for pkg

```



SyntaxError: Unexpected token 'export'
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/@metamask/sdk-install-modal-web/dist/InstallModalWeb.js
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/react-native-webview/index.js:1
(function (exports, require, module, __filename, __dirname) { import WebView from './lib/WebView';
                                                              ^^^^^^

SyntaxError: Cannot use import statement outside a module
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/react-native-webview/index.js:1
(function (exports, require, module, __filename, __dirname) { import WebView from './lib/WebView';
                                                              ^^^^^^

SyntaxError: Cannot use import statement outside a module
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/react-native-webview/index.js
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/react-native-webview/lib/WebView.js:1
(function (exports, require, module, __filename, __dirname) { import React from 'react';
                                                              ^^^^^^

SyntaxError: Cannot use import statement outside a module
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/react-native-webview/lib/WebView.js:1
(function (exports, require, module, __filename, __dirname) { import React from 'react';
                                                              ^^^^^^

SyntaxError: Cannot use import statement outside a module
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/react-native-webview/lib/WebView.js
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/lowercase-keys/index.js:1
(function (exports, require, module, __filename, __dirname) { export default function lowercaseKeys(object) {
                                                              ^^^^^^

SyntaxError: Unexpected token 'export'
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/lowercase-keys/index.js:1
(function (exports, require, module, __filename, __dirname) { export default function lowercaseKeys(object) {
                                                              ^^^^^^

SyntaxError: Unexpected token 'export'
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/lowercase-keys/index.js
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/p-cancelable/index.js:1
(function (exports, require, module, __filename, __dirname) { export class CancelError extends Error {
                                                              ^^^^^^

SyntaxError: Unexpected token 'export'
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
/snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/p-cancelable/index.js:1
(function (exports, require, module, __filename, __dirname) { export class CancelError extends Error {
                                                              ^^^^^^

SyntaxError: Unexpected token 'export'
    at new Script (node:vm:102:7)
    at Socket.<anonymous> ([eval]:18:19)
    at Socket.emit (node:events:537:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)

Node.js v18.5.0
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/p-cancelable/index.js
Pkg: Cached data not produced.
Pkg: Cached data not produced.
> Warning Failed to make bytecode node18-x64 for file /snapshot/James Pollack/Desktop/luckystuff/hexplore/hexploration-cli/node_modules/rustbn.js/lib/index.asm.js
```

keccak change to constructor

```
var Keccak = function Keccak(bits) {
    return {
      blocks: [],
      reset: true,
      block: 0,
      start: 0,
      blockCount: 1600 - (bits << 1) >> 5,
      outputBlocks: bits >> 5,
      s: function (s) {
        return [].concat(s, s, s, s, s);
      }([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    };
  };

```
