- the most general method that uses built in system audio players will open up like windows media player if you play an mp3. so if you wanted to include like one soundtrack song and start it at the beginning of the game, maybe that would work. but the ux is rough
- there aren't really javascript native libraries for decoding and playing audio
- i did manage to take a wav file, encode it as base64, decode that in JS and play it as PCM . all in JS. you do have to include a native bindings file however its only like 150kb. but... it sounds like shit.
- might be good enough for beeps or boops or glitch noises for menu effects

for node-speaker

```
put binding.node from  node_modules/speaker/build/Release/ into /build folder in project root



package.json modules

    "speaker": "^0.5.4",
    "audio-decode": "^2.1.3",

 .pkg try to copy - this didn't work

```

      "sounds/**",
      "node_modules/speaker/build/Release/*.node"

```

```
