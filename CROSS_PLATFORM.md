1. `npm run build`
   - this generates /dist/cli.cjs
   - use `node dist/cli.cjs` to test it at this point
2. `pkg . --options no-deprecation` (build with node option to hide deprecation warnings - see below)
   - this generates /dist-pkg .exe file and other executables
   - use `./dist-pkg/hexploration-cli-win.exe` to start it up
   - or double click the icon

#### exact error for buffer issue

from use of Buffer in buffer-to-arraybuffer module
(node:215124) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
at showFlaggedDeprecation (node:buffer:202:11)
at new Buffer (node:buffer:286:3)
at C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:155779:36
at node_modules/buffer-to-arraybuffer/buffer-to-arraybuffer.js (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:155804:7)
at **require (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:11:50)
at node_modules/xhr-request/lib/request.js (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:155878:25)
at **require (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:11:50)
at node_modules/xhr-request/index.js (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:155926:19)
at **require (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:11:50)
at node_modules/swarm-js/lib/api-node.js (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:157109:21)
at **require (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:11:50)
at node_modules/web3-bzz/lib/index.js (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:157146:17)
at **require (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:11:50)
at node_modules/web3/lib/index.js (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:157194:15)
at **require (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:11:50)
at Object.<anonymous> (C:\Users\James Pollack\Desktop\luckystuff\hexplore\hexploration-cli\dist\cli.cjs:180307:27)
