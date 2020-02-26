const { SuccessModel, ErrorModel } = require('../model/resModel');
const { getBlogList, getBlogDetail, insertBlog, updateBlog, deleteBlog } = require('../controller/blog');

const handleBlogRouter = function(req, res) {
    
    if(req.method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const result = getBlogList(author, keyword);
        return result.then(blogList => {
            return new SuccessModel(blogList);
        })
    }
    if(req.method === 'POST' && req.path === '/api/blog/new') {
        const result = insertBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }
    if(req.method === 'POST' && req.path === '/api/blog/del') {
        const id = req.query.id || '';
        const author = '李四';
        const result = deleteBlog(id, author);
        return result.then(bool => {
            if(bool) {
                return new SuccessModel('博客删除成功');
            }else {
                return new ErrorModel('博客删除失败');
            }
        })
    }
    if(req.method === 'POST' && req.path === '/api/blog/update') {
        const id = req.query.id || '';
        const result = updateBlog(id, req.body);
        return result.then(bool => {
            if(bool) {
                return new SuccessModel('博客更新成功');
            }else {
                return new ErrorModel('博客更新失败');
            }
        })
    }
    if(req.method === 'GET' && req.path === '/api/blog/detail') {
        const id = req.query.id || '';
        const result = getBlogDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

}

module.exports = handleBlogRouter;