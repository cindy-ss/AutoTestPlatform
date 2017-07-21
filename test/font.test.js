/**
 * Created by edel.ma on 7/21/17.
 */

const font = require('../service/font');

font.init(() => {
    console.log(font.check('宁波市海曙区碶闸街 133 号 天一广场 8 号门'));
});