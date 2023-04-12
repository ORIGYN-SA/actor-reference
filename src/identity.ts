import fs from 'fs';
import hdkey from 'hdkey';
import { Secp256k1KeyIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { mnemonicToSeed } from 'bip39';
import { IdentitySecret } from './types';
import { IS_NODE_CONTEXT } from './context';

// Credit:
// https://github.com/Psychedelic/plug-controller/blob/eadc90de738a7fb3d338203540919000f5fd768b/src/utils/identity/parsePem.ts
const ED25519_KEY_INIT = '3053020101300506032b657004220420';
const ED25519_KEY_SEPARATOR = 'a123032100';
const ED25519_OID = '06032b6570';
const SEC256k1_KEY_INIT = '30740201010420';
const SEC256k1_KEY_SEPARATOR = 'a00706052b8104000aa144034200';
const SEC256k1_OID = '06052b8104000a';

const parseEd25519 = (pem: string) => {
  const raw = Buffer.from(pem, 'base64').toString('hex');

  if (!raw.substring(0, 24).includes(ED25519_OID)) {
    return undefined;
  }

  const trimRaw = raw.replace(ED25519_KEY_INIT, '').replace(ED25519_KEY_SEPARATOR, '');

  try {
    const key = new Uint8Array(Buffer.from(trimRaw, 'hex'));
    const identity = Ed25519KeyIdentity.fromSecretKey(key);
    return identity;
  } catch {
    return undefined;
  }
};

const parseSec256K1 = (pem: string) => {
  const raw = Buffer.from(pem, 'base64').toString('hex');

  if (!raw.includes(SEC256k1_OID)) {
    return undefined;
  }

  const trimRaw = raw.replace(SEC256k1_KEY_INIT, '').replace(SEC256k1_KEY_SEPARATOR, '');

  try {
    const key = new Uint8Array(Buffer.from(trimRaw.substring(0, 64), 'hex'));
    const identity = Secp256k1KeyIdentity.fromSecretKey(key);
    return identity;
  } catch {
    return undefined;
  }
};

const getIdentityFromPem = (pem: string) => {
  const trimmedPem = pem
    .replace(/(-{5}.*-{5})/g, '')
    .replace('\n', '')
    // Sepk256k1 keys
    .replace('BgUrgQQACg==', '')
    .trim();

  const parsedIdentity = parseEd25519(trimmedPem) || parseSec256K1(trimmedPem);

  if (!parsedIdentity) throw new Error('invalid key');

  return parsedIdentity;
};

export const getIdentity = async (
  secret: IdentitySecret,
): Promise<Ed25519KeyIdentity | Secp256k1KeyIdentity> => {
  const { pemFilePath, pem, seed } = secret;

  if (seed) {
    const seedBuffer: Buffer = await mnemonicToSeed(seed);
    const root = hdkey.fromMasterSeed(seedBuffer);
    const addrnode = root.derive("m/44'/223'/0'/0/0");
    const identity = Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
    return identity;
  }

  let pemValue = pem;
  if (pemFilePath) {
    pemValue = fs.readFileSync(pemFilePath).toString();
  }

  if (pemValue) {
    return getIdentityFromPem(pemValue);
  }

  throw Error('Must provide a seed phrase or pem to create an identity');
};
