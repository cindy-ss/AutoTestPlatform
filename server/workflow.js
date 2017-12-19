const util = require('../service/util'),
    meta = require('./trans'),
    link = require('./link'),
    vPath = require('./vpath'),
    viewport = require('./viewport'),
    footnote = require('./footnote'),
    copy = require('../service/copy'),
font = require('./font');


//do the flow run.
//collect the basic flow.
const run = async options => {

    let auth = options.auth,
        url = options.url,
        option = options.option;
    url = util.urlNormalize(url);
    let optionObj = JSON.parse(option);
    console.log(optionObj);

    let config = [
        {
            name: 'meta',
            action: metaCheck(url,auth)
        },
        {
            name: 'link',
            action: linkCheck(url,auth)
        },
        {
            name: 'vpath',
            action: vpathCheck(url,auth)
        },
        {
            name: 'viewport',
            action: viewportCheck(url,auth)
        },
        {
            name: "footnote",
            action: footnoteCheck(url,auth)
        },
        {
            name: 'copy',
            action: copyCheck(url,auth)
        },
        {
            name: 'font',
            action: fontCheck(url,auth)
        }
    ];
    let promises =[];

    // console.log(optionObj);

    for(let k=0;k<config.length;k++){
        if((config[k].name) in optionObj && optionObj[config[k].name] === 'true'){
           promises.push(config[k].action);
        }else{
            promises.push(null);
        }
    }

    let obj = {
        url,
        message: null,
        meta: null,
        link: null,
        vPath: null,
        viewport: null,
        footnote: null,
        copy: null,
        font: null
    };
// console.log(obj);
    console.log(options);
    return await Promise.all(promises)
        .then(value => {
            obj['meta'] =  value[0];
            obj['link'] = value[1];
            obj['vPath'] = value[2];
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
                // console.log('1');
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
                console.log('2');
                console.log(data);
                resolve(data);
            }
        })
    })
};

let vpathCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        vPath.runMultiTasks(url, auth, (err,data) => {
            if (err) {
                reject(err);
            } else {
               // console.log('3');
                resolve(data);
            }
        })
    })
};

let viewportCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        viewport.runTask(url, auth, (data) => {
            if(data){
               // console.log('4');
                resolve(data);
            }else{
                reject(data);
            }
        })
    })
};

let footnoteCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        footnote.runTask(url, auth, (data) => {
            if(data) {
                //console.log('5');
                resolve(data);
            }else {
                reject(data);
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
               // console.log('6');
                resolve(data);
            }
        })
    })
};

let fontCheck = (url, auth,option) => {
    return new Promise((resolve, reject) => {
        font.checkByUrl(url, auth, option, (err, data) => {
            if(err) {
                // console.log('8');
                reject(err);
            }else {
                // console.log('7');
                resolve(data);
            }
        })
    })
};
exports.run = run;