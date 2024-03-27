const crypto = require('crypto'),
    env = process.env.NODE_ENV || 'development',
    envVars = require('../config/envVars')[ env ];
exports.encrypt = (data) => {
    // let passwordHash = crypto.createHash('md5').update(envVars.ENCRYPTION_KEY, 'utf-8').digest('hex').toUpperCase();
    let passwordHash = envVars.ENCRYPTION_KEY,
        cipher,
        crypted;

    const iv = new Buffer.alloc(envVars.ENCRYPTION_IV); // fill with zeros
    // console.log('IV: ', iv);
    // var cipher = crypto.createCipher(envVars.ENCRYPTION_METHOD, envVars.ENCRYPTION_KEY);
    cipher = crypto.createCipheriv(envVars.ENCRYPTION_METHOD, passwordHash, iv);
    crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex').toUpperCase();

    return crypted;
};

exports.decrypt = (data) => {
    let decrypted;
    try {
        // let passwordHash = crypto.createHash('md5').update(envVars.ENCRYPTION_KEY, 'utf-8').digest('hex').toUpperCase();
        let passwordHash = envVars.ENCRYPTION_KEY,
            decipher;

        const iv = new Buffer.alloc(envVars.ENCRYPTION_IV); // fill with zeros
        // var decipher = crypto.createDecipher(envVars.ENCRYPTION_METHOD, envVars.ENCRYPTION_KEY);
        decipher = crypto.createDecipheriv(envVars.ENCRYPTION_METHOD, passwordHash, iv);
        decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    } catch (err) {
        // console.log(err);
        decrypted = null;
    }

    return decrypted;
};
exports.decryptBase64 = (data) => {
    let decrypted;
    try {
        // let passwordHash = crypto.createHash('md5').update(envVars.ENCRYPTION_KEY, 'utf-8').digest('hex').toUpperCase();
        let passwordHash = envVars.ENCRYPTION_KEY,
            decipher;

        const iv = new Buffer.alloc(envVars.ENCRYPTION_IV); // fill with zeros
        // var decipher = crypto.createDecipher(envVars.ENCRYPTION_METHOD, envVars.ENCRYPTION_KEY);
        decipher = crypto.createDecipheriv(envVars.ENCRYPTION_METHOD, passwordHash, iv);
        decrypted = decipher.update(data, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8');
    } catch (err) {
        // console.log(err);
        decrypted = null;
    }

    return decrypted;
};
exports.encryptBase64 = (data) => {
    // let passwordHash = crypto.createHash('md5').update(envVars.ENCRYPTION_KEY, 'utf-8').digest('hex').toUpperCase();
    let passwordHash = envVars.ENCRYPTION_KEY,
        cipher,
        crypted;

    const iv = new Buffer.alloc(envVars.ENCRYPTION_IV); // fill with zeros
    // console.log('IV: ', iv);
    // var cipher = crypto.createCipher(envVars.ENCRYPTION_METHOD, envVars.ENCRYPTION_KEY);
    cipher = crypto.createCipheriv(envVars.ENCRYPTION_METHOD, passwordHash, iv);
    crypted = cipher.update(data, 'utf8', 'base64');
    crypted += cipher.final('base64');

    return crypted;
};
exports.decryptSionCash = (data) => {
    let decrypted;
    try {
        
        let passwordHash = envVars.ENCRYPTION_KEY,
            decipher;        
        const iv = new Buffer.alloc(envVars.ENCRYPTION_IV); // fill with zeros
        decipher = crypto.createDecipheriv(envVars.ENCRYPTION_METHOD, passwordHash, iv);
        decrypted = decipher.update(data, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8');
    } catch (ex) {
        console.log("eeeerror: " , ex);         
        decrypted = null;
    }

    return decrypted;
};
