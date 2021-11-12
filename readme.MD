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
#### Android Installation

###### follow the steps :-

Install npm for the library

    cd LibraryForIntegration
    npm install

 Install npm for the project

	npm install

run the project

	npx react-native run-android 

or

	react-native run-android


>` If error appears that 'Unable to resolve module rnsolus or rnsolus not found '` then , copy the contents of LibraryForIntegration, go to your project's node_modules and delete the folder named `rnsolus` and create a new folder with the same name i.e. `rnsolus` and paste the content you copied from LibraryForIntegration.

> Your Project will successfully