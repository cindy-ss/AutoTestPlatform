/**
 *copy test
 */
const copy = require("../service/copy");
copy.compare("https://www.apple.com/hk/en",{odUser: 'qun_ma', odPass: 'Profero@123'},(err,data)=> {
            console.log(data);
            // console.log(data[0]);
            });
// copy.compare("https://www.apple.com/watch/interactive-gallery/",{odUser: 'qun_ma', odPass: 'Profero@123'},(err,data)=> {
//     console.log(data[2]);
//     console.log(data[0]);
// });
//https://ictrunk.apple.com/cn/watch/
//https://www.apple.com/cn/watch/interactive-gallery/
