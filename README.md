# Hexploration CLI

## Clone Hexploration and Hexploration CLI to same directory

```
gh repo clone LuckyMachines/hexploration
```

```
gh repo clone LuckyMachines/hexploration-cli
```

## Create .env file with RPC providers

- use `.env-example` as a template

## Setup Private Keys in `hexploration-cli`

- Create .privatekey file and move to /bin

## Install hexploration-cli:

```
cd hexploration-cli
```

```
yarn
```

## Start CLI:

```
npx hexploration-cli
```

## Arguments:

`-n` = start new game

## Change network:

Uncomment selected chain in src/provider.js and src/contract.js
