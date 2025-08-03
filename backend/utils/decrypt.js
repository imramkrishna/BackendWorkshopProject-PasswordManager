import CryptoJS from "crypto-js"

const secret = process.env.CRYPTO_SECRET

async function decryptPassword(encryptedPassword) {
    try {
        if (!encryptedPassword) {
            console.error('No encrypted password provided');
            return '';
        }

        if (!secret) {
            console.error('CRYPTO_SECRET not found in environment variables');
            return 'Decryption error: No secret';
        }

        const bytes = CryptoJS.AES.decrypt(encryptedPassword, secret);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedPassword) {
            console.error('Failed to decrypt password - invalid secret or corrupted data');
            return 'Decryption failed';
        }

        return decryptedPassword;
    } catch (error) {
        console.error('Error in decryptPassword:', error);
        return 'Decryption error';
    }
}

export default decryptPassword;