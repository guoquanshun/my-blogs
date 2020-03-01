const fs = require('fs');
const path = require('path');

// 生成writeStream
const createWriteStream = function(file) {
    const fileName = path.resolve(__dirname, `../../logs/${file}`);
    return fs.createWriteStream(fileName);
}

const write = (writeStream, content) => {
    writeStream.write(content + '\n');
}
const accessWriteStream = createWriteStream('access.log');
const access = content => {
    write(accessWriteStream, content);
}

module.exports = {
    access
}
