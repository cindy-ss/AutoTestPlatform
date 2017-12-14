const util = require('../service/util'),
    meta = require('./trans'),
    link = require('./link'),
    vpath = require('./vpath'),
    viewport = require('./viewport'),
    footnote = require('./footnote'),
    copy = require('../service/copy'),
font = require('./font');


//do the flow run.
//collect the basic flow.
const run = async options => {

    let auth = options.auth,
        url = options.url;

    let promises = [
        metaCheck(url, auth),
        linkCheck(url, auth),
        vpathCheck(url,auth),
        viewportCheck(url,auth),
        footnoteCheck(url,auth),
        copyCheck(url,auth),
        fontCheck(url, auth)

    ];

    let obj = {
        url,
        message: null,
        meta: null,
        link: null,
        vpath: null,
        viewport: null,
        footnote: null,
        copy: null
    };

    return await Promise.all(promises)
        .then(value => {
            obj['meta'] = value[0];
            obj['link'] = value[1];
            obj['vpath'] = value[2];
            obj['viewport'] = value[3];
            obj['footnote'] = value[4];
            obj['copy'] = value[5];
            obj['font'] = value[6];
            return obj;
        }).catch(err => {
            console.log(err.message);
            obj.message = err.message;
            return obj;
        });
};

let metaCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        meta.runTask(url, auth, (data) => {
            if (data) {
                resolve(data);
            } else {
                reject(data);
            }
        });
    });
};

let linkCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        link.getLinks(url, auth, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};

let vpathCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        vpath.getVPaths(url, auth, (err,data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};

let viewportCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        viewport.runTask(url, auth, (err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
};

let footnoteCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        footnote.runTask(url, auth, (err, data) => {
            if(err) {
                reject(err);
            }else {
                resolve(data);
            }
        })
    })
};

let copyCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        copy.compare(url, auth, (err, data) => {
            if(err) {
                reject(err);
            }else {
                resolve(data);
            }
        })
    })
};

let fontCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        font.check(url, auth, (err, data) => {
            if(err) {
                reject(err);
            }else {
                resolve(data);
            }
        })
    })
};
exports.run = run;