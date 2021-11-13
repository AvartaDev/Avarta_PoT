"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticate = authenticate;
exports.enroll = enroll;
exports.multiply = multiply;

var _reactNative = require("react-native");

const LINKING_ERROR = `The package 'facetec-rn' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const FacetecRn = _reactNative.NativeModules.FacetecRn ? _reactNative.NativeModules.FacetecRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});

function multiply(a, b) {
  return FacetecRn.multiply(a, b);
}

function enroll() {
  return FacetecRn.enroll();
}

function authenticate(id) {
  return FacetecRn.authenticate(id);
}
//# sourceMappingURL=index.js.map