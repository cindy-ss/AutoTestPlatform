let wf = require('../server/workflow');
    basic = require('../service/basic');

let options = {
    url: 'https://www.apple.com/cn/iphone-x',    meta: true,
    font: true,
    link: true,
    vPath: true,
    viewPort: true,
    footNote: true,
    copy: true,
    auth: {
        odUser: 'qun_ma',
        odPass: 'Profero@123'
    }
};

basic.init(() => {
    wf.run(options).then(data => {
        console.log('-----------');
        console.log(data);
        console.log('-------------');
    });
});