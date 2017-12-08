const meta = require('./trans');

//do the flow run.
//collect the basic flow.
const run = async options => {
    // let res = await Promise.all()
    let auth = options.auth,
        url = options.url;

    let res = {
        url,
        meta : options.meta ? await metaCheck(url, auth) : null,
        link : ''
    };

    return res;
};

let metaCheck = (url, auth) => {
    return new Promise((resolve, reject) => {
        meta.runTask(url, auth, (data) => {
            if(data){
                resolve(data);
            }else{
                reject(data);
            }
        });
    });
};

exports.run = run;