const l = require('../server/link');

const auth = {odUser: 'qun_ma', odPass: 'Profero@123'};

l.getLinks('www.apple.com/cn', auth, (err, data) => {
    console.log(err);
    console.log(data);
});