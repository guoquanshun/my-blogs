const fs = require('fs')
const path = require('path');

const fileName = path.resolve(__dirname, 'log.text');

// 读取文件
// fs.readFile(fileName, (error, data) => {
//     if(error) {
//         console.error(error);
//         return
//     }
//     // data是二进制数据，需要转化为字符串
//     console.log(data.toString());
// })

// 写入文件
// const opt = {
//     flag: 'w'
// }
// const content = '这是新内容\n'
// fs.writeFile(fileName, content, opt, err => {
//     if(err) {
//         console.error(err);
//     }
// })

// 判断文件是否存在
fs.exists(fileName+'1', exist => {
    console.log('exist is ', exist);
})