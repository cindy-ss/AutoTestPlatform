const l = require('../server/link');
const basic = require('../service/basic');
//
const auth = {odUser: 'qun_ma', odPass: 'Profero@123'};

basic.init(() => {
    l.getLinks('https://www.apple.com/cn/iphone-x', auth, (err, data) => {
        console.log(err);
        // data.forEach(item => {
        //     if(item.status !== 'pass'){
        //         console.log(item);
        //     }
        // })
    });
});
//https://ictrunk.apple.com/hk/iphone-x
// https://ictrunk.apple.com/hk/en/iphone-x