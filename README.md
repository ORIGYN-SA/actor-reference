# Actor Reference Helper Library

Simplifies the process of creating actor references. An [actor reference](https://internetcomputer.org/docs/current/motoko/main/language-manual/#actor-references) is an object in JavaScript that invokes remote function calls on an Internet Computer canister, running a WebAssembly module that implements the Internet Computer Actor Interface.

This library is intended to simplify and standardize the process of creating actor references for Origyn DApps (decentralized applications).

## Quick Start

To get started, install the library using npm:

```
npm i @origyn/actor-reference
```

## Usage

### Importing the Library

**_TypeScript and ES6 Modules_**

This example below demonstrates authenticating with a seed phrase, but here are all supported authentication methods:

- none - anonymous authentication
- `agent` - an instance of an Agent from the `@dfinity/agent` library
  - for browser environments where users connect dApps via wallets such as Internet Identity, Plug, or Stoic, and the wallet provides the agent instance
- `seed` - a 12 word seed phrase
- `pem` - a PEM-encoded private key
- `pemFilePath` - a path to a PEM-encoded private key file

```typescript
import { getActor, ActorOptions, getIdentity } from '@origyn/actor-reference';
import { MyCanister } from './.dfx/local/canisters/my_canister/my_canister.did.d.ts';
import { idlFactory } from './.dfx/local/canisters/my_canister/my_canister.did.js';

const identity = await getIdentity({
  // example only - production code should protect secrets
  seed: 'control work legal artist base state sample try city pond demise exist',
});

const options: ActorOptions<MyCanister> = {
  canisterId: 'renrk-eyaaa-aaaaa-aaada-cai',
  idlFactory,
  identity,
};

const actor = await getActor<MyCanister>(options);

const myMethod = async () => {
  const result = await actor.myMethod();
  return result;
};
```

# Contributors

## Building and Testing the library

```
npm ci
npm run build
npm test
```

## GitLab and GitHub Hosting

This repository is maintained on a private `GitLab` server. When code is merged into the `develop` or `main` branch, the entire `GitLab` repository is mirrored to the `GitHub` repository, overwriting any changes since the last mirror. Therefore, all changes should be made to the `GitLab` repository.

## Branching Strategy

The branching strategy used in this repository is as follows:

- The `develop` branch is the center of all development. All feature branches are branched from, and merged back into the `develop` branch. Integration testing of multiple features is done from the `develop` branch.
- The `main` branch is the release branch. The library is published to `npm` from the `main` branch.

Both the `develop` and `main` branches are protected, so only administrators can push directly to these branches. However, all changes after the initial commit should **only** be made through merge requests.
