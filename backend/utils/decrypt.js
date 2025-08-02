import CryptoJS from "crypto-js"
const secret = process.env.CRYPTO_SECRET
async function decryptPassword(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secret)
    const password = bytes.toString(CryptoJS.enc.Utf8);
    return password
}
export default decryptPassword;