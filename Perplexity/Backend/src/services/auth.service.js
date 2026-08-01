import argon2 from 'argon2';

async function normalizeCredentials(email , password) {
    const passwordHash = await argon2.hash(password);
    const normalizedEmail = email.toLowerCase().trim();
    return { normalizedEmail, passwordHash };
}

async function verifyPassword(password, passwordHash) {
    const isVerified = await argon2.verify(passwordHash, password);
    return isVerified;
}

export { normalizeCredentials, verifyPassword };