## Avarta Mobile Wallet

- Clone this repo and install our dependencies:

```bash
git clone ...
cd AvartaWallet
yarn install
yarn run postinstall # this will run a lengthy postinstall flow
cd ios && pod install && cd .. # install pods for iOS
```
#### iOS

- Install the iOS dependencies
  - [React Native Getting Started - iOS](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies-1) _(React Native CLI Quickstart -> [your OS] -> iOS)_
    - You do **not** need CocoaPods
- Install the correct simulator
  - **iOS OS Version:** Latest, unless told otherwise
  - **Device:** iPhone 11 Pro

```bash
yarn start:ios
```

```bash
yarn start # run app metro
```
