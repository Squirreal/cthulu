var CryptoJS = require('./aes.js');
var key = CryptoJS.enc.Utf8.parse('9ef1c0d959184b3f');  //秘钥
var iv = CryptoJS.enc.Utf8.parse('67f3a39255edbb4e');   //秘钥偏移量

function decrypt(word) {
    var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

function encrypt(word) {
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
}

module.exports = {
    decrypt: decrypt,
    encrypt: encrypt
}