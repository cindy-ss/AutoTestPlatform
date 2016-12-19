'use strict';
const fs = require('fs');
const crypto = require('crypto');

let str1 = fs.readFileSync('./fuck.json', 'utf-8');

let hash = crypto.createHash('md5');

hash.update(str1);

console.log(hash.digest('hex'));