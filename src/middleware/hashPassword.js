const crypto = require('crypto');

function hashPassword(plainPassword, salt) {
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex');
    }
    const hashedPassword = crypto
        .pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha1')
        .toString('hex');

    return {
        pass: hashedPassword,
        salt: salt,
    };
}
module.exports = hashPassword;
