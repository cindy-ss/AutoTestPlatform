const meta = require('./trans'),
    link = require('./link');

//do the flow run.
//collect the basic flow.
const run = async options => {
    let auth = options.auth,
        url = options.url;

    let promises = [
        metaCheck(url, auth),
        linkCheck(url, auth)
    ];

    let obj = {
        url,
        message : null,
        meta : null,
        link : null
    };

    let res = await Promise.all(promises);

    return res;

    //     .then(value => {
    //     obj['meta'] = value[0];
    //     obj['link'] = value[1];
    //
    //     return obj;
    // }, err => {
    //     obj['message'] = err;
    //     return obj;
    // });
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
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
};

exports.run = run;