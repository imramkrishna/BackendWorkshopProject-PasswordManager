import jwt from 'jsonwebtoken';

async function generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7h' });
}
async function generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
export { generateAccessToken, generateRefreshToken };