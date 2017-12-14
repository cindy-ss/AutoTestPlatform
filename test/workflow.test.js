let wf = require('../server/workflow');
    // basic = require('../service/basic');

let options = {
    url: 'https://www.apple.com/cn/iphone-x',    meta: false,
    font: false,
    link: true,
    vPath: false,
    viewPort: false,
    footNote: false,
    copy: false,
    auth: {
        odUser: 'qun_ma',
        odPass: 'Profero@123'
    }
};

// basic.init(() => {
//     wf.run(options).then(data => {
//         console.log(data);
//     });
// });