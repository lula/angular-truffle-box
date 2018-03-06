# Truffle Box for Angular

_This repo is fork of [Quintor/angular-truffle-box](https://github.com/Quintor/angular-truffle-box)._

This Truffle Box provides a base for working with the Truffle Framework and Angular.
It provides a basic working example of the MetaCoin contracts with Angular components.
This project is generated with [Angular CLI](https://cli.angular.io/).

## Changes from original repo

\+ MetaCoin Transfer event listening

\+ ng-boostrap (bootstrap 4 + octicons)

\- refresh account interval: for those who like me don't like intervals :)

Tested with [Ganache CLI](https://github.com/trufflesuite/ganache-cli).

## Prerequisites

In order to run the Truffle box, you will need [Node.js](https://nodejs.org) (tested with version 8.9.x). This will include `npm`, needed
to install dependencies. In order install these dependencies, you will also need [Python](https://www.python.org) (version 2.7.x) and
[git](https://git-scm.com/downloads). You will also need the [MetaMask](https://metamask.io/) plugin for Chrome.

## Building

Install truffle, Angular CLI and an Ethereum client. This repo was tested using Ganache CLI.
  ```bash
  npm install -g truffle
  npm install -g @angular/cli
  npm install -g ganache-cli
  ```

Download the box.
  ```bash
  truffle unbox lula/angular-truffle-box
  ```

Run Ganache to run your private network:
  ```bash
  ganache-cli --noVMErrorsOnRPCResponse 
  ```
  Note the mnemonic 12-word phrase printed on startup, you will need it later.

Compile and migrate your contracts.
  ```bash
  truffle compile && truffle migrate
  ```

## Configuration

In order to connect with the Ethereum network, you will need to configure MetaMask

1. Log into the `ganache-cli` test accounts in MetaMask, using the 12-word phrase printed earlier.
    - A detailed explaination of how to do this can be found [here](http://truffleframework.com/docs/advanced/truffle-with-metamask#using-the-browser-extension)
        - Normally, the available test accounts will change whenever you restart `ganache-cli`.
        - In order to receive the same test accounts every time you start `ganache`, start it with a seed like this: `ganache-cli --seed 0` or `ganache-cli -m "put your mnemonic phrase here needs twelve words to work with MetaMask"`
2. Point MetaMask to `ganache-cli` by connecting to the network `localhost:8545`

## Running

Run the app using Angular CLI:

  ```bash
  ng serve
  ```

The app is now served on localhost:4200.

Making sure you have configured MetaMask, visit http://localhost:4200 in your browser (you can test it without MetaMastk too).

Send MetaCoins!

## Testing

Running the Angular component tests:
  ```bash
  ng test
  ```

Running the Truffle tests:
  ```bash
  truffle test
  ```

Running Protactor end-to-end tests

  ```bash
  ng e2e
  ```
## Releasing
Using the Angular CLI you can build a distributable of your app. Will be placed in `dist/`

  ```bash
  ng build
  ```

## FAQ

* __Where can I find more documentation?__

This Truffle box is a union of [Truffle](http://truffleframework.com/) and an Angular setup created with [Angular CLI](https://cli.angular.io/).
For solidity compilation and Ethereum related issues, try the [Truffle documentation](http://truffleframework.com/docs/).
For Angular CLI and typescript issues, refer to the [Angular CLI documentation](https://github.com/angular/angular-cli/wiki)