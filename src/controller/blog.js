const xss = require('xss');
const { exec } = require('../db/mysql')

const getBlogList = function(author, keyword) {
    let sql = `select * from blogs where 1=1 `;
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`;
    console.log('sql', sql);
    return exec(sql);
}

const getBlogDetail = id => {
    const sql = `select * from blogs where id=${id}`;
    return exec(sql).then(rows => {
        return rows[0];
    })
}

const insertBlog = (bodyData = {}) => {
    const { author, title, content } = bodyData;
    const sql = `
        insert into blogs (author, title, content, createtime) values ('${xss(author)}', '${xss(title)}', '${xss(content)}', ${Date.now()});
    `;
    return exec(sql).then(data => {
        return {
            id: data.insertId
        }
    })
}

const updateBlog = (id, bodyData = {}) => {
    const { title, content } = bodyData;
    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id};
    `;
    return exec(sql).then(res => {
        if(res.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

const deleteBlog = (id, author) => {
    const sql = `
        delete from blogs where id=${id} and author='${author}';
    `;
    console.log(sql);
    return exec(sql).then(deleteData => {
        if(deleteData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

module.exports = {
    getBlogList,
    getBlogDetail,
    insertBlog,
    updateBlog,
    deleteBlog
}