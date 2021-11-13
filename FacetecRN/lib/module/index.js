import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package 'facetec-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const FacetecRn = NativeModules.FacetecRn ? NativeModules.FacetecRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
export function multiply(a, b) {
  return FacetecRn.multiply(a, b);
}
export function enroll() {
  return FacetecRn.enroll();
}
export function authenticate(id) {
  return FacetecRn.authenticate(id);
}
//# sourceMappingURL=index.js.map