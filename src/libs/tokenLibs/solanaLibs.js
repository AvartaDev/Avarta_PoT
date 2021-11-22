import {Platform} from 'react-native';
import * as Bip39 from 'react-native-bip39';
import {mnemonicToSeed} from '@libs/bip39/index';
import * as Web3 from '@solana/web3.js';
import * as ed25519 from 'ed25519-hd-key';
import {web3Provider} from '@libs/transaction';

const DEFAULT_HD_PATH = `m/44'/501'`;

const getConnection = () => {
  return new Web3.Connection(Web3.clusterApiUrl('devnet'), 'confirmed');
};

const deriveAccountFromMnemonic = async (mnemonic, index = 0) => {
  let res;
  if (Platform.OS == 'ios') {
    res = await mnemonicToSeed(mnemonic);
  } else {
    res = await Bip39.mnemonicToSeed(mnemonic, null);
  }

  //key is the buffer used to get solana account
  const {key} = ed25519.derivePath(DEFAULT_HD_PATH, res.toString('hex'));
  const keyPair = Web3.Keypair.fromSeed(key);
  const wallet = {
    address: keyPair.publicKey.toString(),
    walletPrv: Array.from(keyPair.secretKey),
  };
  return wallet;
};

export const getWalletBalance = async address => {
  const connection = getConnection();
  const publicKey = new Web3.PublicKey(address);
  const res = await connection.getBalance(publicKey, 'finalized');
  return res / Web3.LAMPORTS_PER_SOL;
};

const sendTokens = async (target, value, wallet, onReceiveTxHash) => {
  const connection = getConnection();
  const prv = Uint8Array.from(wallet.walletPrv);
  const toPubKey = new Web3.PublicKey(target);

  const from = Web3.Keypair.fromSecretKey(prv);

  const trxInstruction = Web3.SystemProgram.transfer({
    fromPubKey: from.publicKey,
    toPubKey: toPubKey,
    lamports: value * Web3.LAMPORTS_PER_SOL,
  });

  //trxInstruction.keys[*].pubKey will be undefined unless manual init happens
  const keys = [
    {
      pubkey: from.publicKey,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: toPubKey,
      isSigner: false,
      isWritable: true,
    },
  ];

  trxInstruction.keys = keys;

  console.log(trxInstruction);
  const transaction = new Web3.Transaction().add(trxInstruction);

  const signature = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from],
  );

  console.log('SIGNATURE', signature);
  onReceiveTxHash(signature);
};
export default solanaLibs = {
  deriveAccountFromMnemonic,
  sendTokens,
  getWalletBalance,
};
