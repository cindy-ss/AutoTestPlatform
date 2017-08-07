/**
 * Created by edel.ma on 7/12/17.
 */

const webdriver = require('selenium-webdriver');
const phantomjs_exe = require('phantomjs-prebuilt').path;
const customPhantom = webdriver.Capabilities.phantomjs();
customPhantom.set("phantomjs.binary.path", phantomjs_exe);
//build custom phantomJS driver
const driver = new webdriver.Builder().withCapabilities(customPhantom).build();

const fs = require('fs');

let src = 'https://www.apple.com/';

// const navigation = driver.navigate();

driver.get(src).then(() => {
        driver.takeScreenshot().then(data => {
            console.log(data.substr(0, 40));
            const dataBuffer = new Buffer(data, 'base64');
            fs.writeFileSync('./A.png', dataBuffer);
        });
    }
);

