// Generate Alice's keys
const alice = dh.createDiffieHellman(128);
const aliceKey = alice.generateKeys();
const prime = alice.getPrime('hex').toString('hex');

// Generate Bob's keys...
const bob = dh.createDiffieHellman(prime, 'hex');
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey).toString('hex');
const bobSecret = bob.computeSecret(aliceKey).toString('hex');
aliceSecret.toString('hex') == bobSecret.toString('hex')
// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));

// On document creation, instantiate object with name _DC_{id}
// It will contain an object with the metadata for the document including
// docId, prime(hex), publicKey, privateKey
// use dh.createDiffieHellman(128) to create object.
const dhObject = dh.createDiffieHellman(128);
const publicKeyObj = dhObject.generateKeys();
const publicKey = publicKeyObj.toString('hex')
const prime = dhObject.getPrime('hex');

const secondaryDhObject = dh.createDiffieHellman(prime, 'hex');
const secondKeys = secondaryDhObject.generateKeys();


const encryptionKey = secondaryDhObject.computeSecret(publicKeyObj);

const bob = dh.createDiffieHellman(prime, 'hex');
const bobKey = bob.generateKeys();

const bob = dh.createDiffieHellman(prime, 'hex');
// use privateKey to encr
// localStorage object containing i

 
// Generate Alice's keys
const alice = dh.createDiffieHellman(128);
const aliceKey = alice.generateKeys().toString('hex');
const prime = alice.getPrime('hex').toString('hex');

// Generate Bob's keys...
const bob = dh.createDiffieHellman(prime, 'hex');
const bobKey = bob.generateKeys().toString('hex');

// Generate Tim's keys...
const tim = dh.createDiffieHellman(prime, 'hex');
const timKey = tim.generateKeys().toString('hex');

// To convert from hex string to array: https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

bob.computeSecret(fromHexString(aliceKey)).toString('hex') == alice.computeSecret(fromHexString(bobKey)).toString('hex')

tim.computeSecret(fromHexString(aliceKey)).toString('hex') == alice.computeSecret(fromHexString(timKey)).toString('hex')

tim.computeSecret(fromHexString(aliceKey)).toString('hex') == alice.computeSecret(fromHexString(timKey)).toString('hex')