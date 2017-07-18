/**
 * Created by edel.ma on 7/17/17.
 */
const q = require('../service/query');
const cheerio = require('cheerio');
const fontkit = require('fontkit');

q.query('http://www.apple.com/cn/', (err, data) => {
    const $ = cheerio.load(data);
    const text = $("body").text().replace(/ /g, "").replace(/\n/g, "").replace(/\t/g, "");

    const font = fontkit.openSync('./font.woff');

    font.characterSet.forEach(item => {
        // console.log(item.toString(16));
    });

    for(let i of text){
        console.log(font.characterSet.indexOf(i.charCodeAt(0)));
    }
});