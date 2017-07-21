/**
 * Created by edel.ma on 7/21/17.
 */

const gh = require('../service/geo_helper');

console.log(gh.us2geo('https://images.apple.com/v/mac/home/w/images/home/imac_pro_large.jpg'));

console.log(gh.us2geo('https://images.apple.com/v/mac/home/w/images/home/imac_pro_large.jpg', 'cn'));

console.log(gh.geo2us('https://images.apple.com/cn/mac/home/w/images/home/imac_pro_large.jpg'));

console.log(gh.geo2us('https://images.apple.com/hk/mac/home/w/images/home/imac_pro_large.jpg'));

console.log(gh.geo2us('https://images.apple.com/hk/en/mac/home/w/images/home/imac_pro_large.jpg'));