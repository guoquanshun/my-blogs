const { exec } = require('../db/mysql');

const checkLogin = (username, password) => {
    const sql = `
        select username, password from users where username='${username}' and password='${password}';
    `
    const result = exec(sql).then(data => {
        if(data.length > 0) {
            return true;
        }
        return false;
    });
    return result;
}

module.exports = {
    checkLogin
}