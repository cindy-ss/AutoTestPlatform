const q = require('./query'),
    archiver = require('archiver'),
    async = require("async"),
    path = require("path"),
    fs = require("fs"),
    util = require("./util");

const MAX_LIMIT = 5;

const down = (src, target, auth, cb) => {
    q.downQuery(src, target, (err) => {
        cb(err);
    }, auth)
};

const downZip = (src, auth, cb) => {
    let t = new Date().getTime();
    let arr = [];
    async.eachLimit(src, MAX_LIMIT, (url, callback) => {
        down(url, `./tmp/${t}/${path.basename(url)}`, auth, err => {
            arr.push(`./tmp/${t}/${path.basename(url)}`);
            callback(err);
        })
    }, err => {
        let output = fs.createWriteStream(`./tmp/${t}.zip`);
        let archive = archiver('zip', {
            zlib: {level: 9}
        });

        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            util.deleteFolder(`./tmp/${t}/`);
            cb(null, `${t}.zip`);
        });

        archive.on('error', function (err) {
            cb(err, null);
        });

        archive.pipe(output);

        archive.directory(`./tmp/${t}/`, false);

        archive.finalize();
    })
};

exports.down = down;
exports.downZip = downZip;