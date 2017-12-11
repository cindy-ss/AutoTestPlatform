const meta = require('./trans'),
    link = require('./link');

//do the flow run.
//collect the basic flow.
const run = async options => {
    let auth = options.auth,
        url = options.url;

    return {
        url,
        meta: options.meta ? await metaCheck(url, auth) : null,
        link: options.link ? await linkCheck(url, auth) : null,
    };
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