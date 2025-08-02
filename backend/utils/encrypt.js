import CryptoJs from 'crypto-js';
const secret = process.env.CRYPTO_SECRET
async function encryptPassword(Password) {
    const password = CryptoJs.AES.encrypt(Password, secret).toString();
    return password;
}
export default encryptPassword