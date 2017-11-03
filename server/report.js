let ejs = require('ejs'),
    fs = require('fs');

const create = (obj) => {
    let file = obj['file'];
    let str = fs.readFileSync(`./server/templates/${file}.ejs`, 'utf-8');
    let outStr = ejs.render(str, obj);

    const fileName = `report-${new Date().getTime()}.html`;
    const exportPath = `./static/data/${fileName}`;

    fs.writeFileSync(exportPath, outStr, 'utf-8');

    return fileName;
};

exports.create = create;