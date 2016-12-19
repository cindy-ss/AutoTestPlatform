/**
 * Created by Edel on 16/9/6.
 */

const fs = require('fs');
const gm = require('gm');

//gm('/Users/Edel/H/img/0822/06.jpg')
//.identify((err, data) => {
//    console.log(err);
//    console.log(data);
//});

gm(214, 44, '#ff0088')
.fontSize(30)
.drawText(10, 25, 'fuck')
.drawLine(
    parseInt(Math.random()*210+1),
    parseInt(Math.random()*40+1),
    parseInt(Math.random()*210+1),
    parseInt(Math.random()*40+1)
)
.write('./fuck.jpg', data => console.log(data));