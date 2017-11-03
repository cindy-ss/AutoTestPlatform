const fs = require('fs');

const create = content => {
    const fileName = `report-${new Date().getTime()}.html`;
    const exportPath = `./static/data/${fileName}`;

    fs.writeFileSync(exportPath, content, 'utf-8');

    return fileName;
};

exports.create = create;