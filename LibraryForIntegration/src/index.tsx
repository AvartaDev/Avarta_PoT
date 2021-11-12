import { NativeModules } from 'react-native';

type RnsolusType = {
  // multiply(a: number, b: number): Promise<number>;
};

const { Solus } = NativeModules;

export default Solus as RnsolusType;
