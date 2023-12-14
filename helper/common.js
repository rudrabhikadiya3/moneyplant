const moment = require('moment')
const crypto = require('crypto')

export function enc(textToEncrypt, secret) {
    const iv = secret.substr(0, 16)
    const encryptor = crypto.createCipheriv('aes-256-ctr', secret, iv)
    return encryptor.update(textToEncrypt, 'utf8', 'base64') + encryptor.final('base64')
}

export function dec(encryptedMessage, secret) {
    const iv = secret.substr(0, 16)
    const decryptor = crypto.createDecipheriv('aes-256-ctr', secret, iv)
    return decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8')
}

export function ft(a, b = 0) {
    return parseFloat(parseFloat(a).toFixed(b))
}

export function convert_str(str) {
    return str.toString()
}

export const OTP = Math.floor(100000 + Math.random() * 900000)

export function chk_otp(str) {
    return /^[0-9]{6}$/.test(str)
}

export function chk_username(a) {
    return /^[a-zA-Z0-9]{5,15}$/.test(a)
}

export function chk_email(str) {
    return /^[a-z_0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z0-9]+)*(\.[a-z]{2,3})$/.test(str)
}
export function chk_password(str) {
    // aA1$
    return /^\S*(?=\S{8,30})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[!\\/\\\\\"#$%&'()*+,-.\\:;<=>?@[\]^_`{|}~])\S*$/.test(str)
}

export function chk_float(str) {
    return /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/.test(str)
}

export function chk_int(str) {
    return /^[0-9]{1,}$/.test(str)
}

export function chk_URL(str) {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(str)
}

export function chk_2precision(str) {
    return /^[0-9]+(\.\d{0,2})?$/.test(str)
}

export function trunc(string, len) {
    len = 5 || len
    return string.substr(0, len) + '.....' + string.substr(-len)
}

export function numb(num, desPoint = 8) {
    return parseFloat(
        parseFloat(num)
            .toFixed(desPoint)
            .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
    )
}

export function firstTimeStamp() {
    const d = new Date()
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    const startTime = d / 1000
    return startTime
}

export function getRandomString(len) {
    const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890'
    const randomArray = Array.from(
        { length: len },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    )
    const randomString = randomArray.join('')
    return randomString
}

export function getstr(len) {
    const chars = 'AaBb&*()_CcDdEeFfGgHhI`~!@iJjKkLlMmNnOo#$%^PpQ67qRrS-{}[sTtUuVvWwXxYyZz12345890];:?/'
    const randomArray = Array.from(
        { length: len },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    )
    const randomString = randomArray.join('')
    return randomString
}

export function chk_pin(str) {
    return /^[0-9]{4}$/.test(str)
}

export function dateConvert(date) {
    return moment(date * 1000).format('DD, MMM YYYY hh:mm A')
}

export const NOW = () => {
    return Math.round(Date.now() / 1000)
}

export const refCode = (length) => {
    length = length || 6
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const getDates = (d1, d2) => {
    d1 = d1 * 1000
    d2 = d2 * 1000
    var oneDay = 24 * 3600 * 1000;
    for (var d = [], ms = d1 * 1, last = d2 * 1; ms < last; ms += oneDay) {
        d.push(new Date(ms));
    }
    return d;
}

export const UTStoDate = (utc) => {
    const date = new Date(utc);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();


    // let hours = date.getHours();
    // let seconds = date.getUTCSeconds() < 10 ? "0" + date.getUTCSeconds() : date.getUTCSeconds();
    // let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    // let time = `${day}/${month + 1}/${year} ${hours}:${minutes}:${seconds}`;
    let time = `${day}/${month + 1}/${year}`;
    return time;
};



// const getDaysRange = (st, ed) => {
//     const startDate = new Date(st * 1000);
//     const endDate = new Date(ed * 1000);
//     const dates = [];
//     for (let date = new Date(startDate);date <= endDate;date.setDate(date.getDate() + 1)) {
//         dates.push(UTStoDate(new Date(date)));
//     }

// }

// getDaysRange(1681903640, NOW)