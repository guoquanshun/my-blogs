const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user')
const { set } = require('../db/redis')

const handleUserRouter = function(req, res) {
    if(req.method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body;
        const result = login(username, password);
        return result.then(data => {
            if(data.username) {
                req.session.username = data.username;
                req.session.realname = data.realname;
                set(req.sessionId, req.session); // 同步到session
                return Promise.resolve(new SuccessModel());
            }
            return Promise.resolve(new ErrorModel('登录失败')) 
        })
    }

    // 测试登录
    // if(req.method === 'GET' && req.path === '/api/user/login-test') {
    //     if(req.cookie.username) {
    //         return Promise.resolve(new SuccessModel({username: req.cookie.username}));
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录'))
    // }

}

module.exports = handleUserRouter;