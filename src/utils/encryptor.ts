const crypto = require('crypto');

const cryptoAlgorithmLengths: Record<string, { key: number, iv: number }> = {
  'aes-128-cfb': {
    key: 16,
    iv: 16,
  },
  'aes-192-cfb': {
    key: 24,
    iv: 16,
  },
  'aes-256-cfb': {
    key: 32,
    iv: 16,
  },
  'bf-cfb': {
    key: 16,
    iv: 8,
  },
  'camellia-128-cfb': {
    key: 16,
    iv: 16,
  },
  'camellia-192-cfb': {
    key: 24,
    iv: 16,
  },
  'camellia-256-cfb': {
    key: 32,
    iv: 16,
  },
  'cast5-cfb': {
    key: 16,
    iv: 8,
  },
  'des-cfb': {
    key: 8,
    iv: 8,
  },
  'idea-cfb': {
    key: 16,
    iv: 8,
  },
  'rc2-cfb': {
    key: 16,
    iv: 8,
  },
  'rc4': {
    key: 16,
    iv: 0,
  },
  'rc4-md5': {
    key: 16,
    iv: 16,
  },
  'seed-cfb': {
    key: 16,
    iv: 16,
  },
};


const getAlgorithmLengths = (algorithm: string) => {
  return cryptoAlgorithmLengths[algorithm];
}

const getMD5Hash = (data: any) => {
  return crypto.createHash('md5').update(data).digest();
}

export const createRandomIV = (algorithm: string) => {
  return crypto.randomBytes(getAlgorithmLengths(algorithm).iv)
}

export const generateKey = (algorithm: string, secret: string) => {
  const secretBuf = Buffer.from(secret, 'utf8');
  const keyLength = getAlgorithmLengths(algorithm).key;

  var tokens: any[] = [];
  var i = 0;
  var hash: any = void 0;
  var length = 0;

  if (!keyLength) {
    throw new Error(`Encryptor: Algorithm ${algorithm} not supported`);
  }

  while (length < keyLength) {
    hash = getMD5Hash(i === 0 ? secretBuf : Buffer.concat([tokens[i - 1], secretBuf]));
    tokens.push(hash);
    i++;
    length += hash.length;
  }

  hash = Buffer.concat(tokens).slice(0, keyLength);

  return hash;
}

export const createCipher = (secret: string, algorithm: string, data: Buffer, _iv?: Buffer) => {
  const key = generateKey(algorithm, secret);
  const iv = _iv || createRandomIV(algorithm);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  return {
    cipher: cipher,
    data: Buffer.concat([iv, cipher.update(data)])
  };
}

export const createDecipher = (secret: string, algorithm: string, data: Buffer) => {

  const key = generateKey(algorithm, secret);
  const ivLength = getAlgorithmLengths(algorithm).iv;
  const iv = Buffer.from(data.slice(0, ivLength));


  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decryptedData = decipher.update(Buffer.from(data.slice(ivLength)));


  return {
    decipher: decipher,
    data: decryptedData
  };
}