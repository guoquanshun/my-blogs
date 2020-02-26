const { SuccessModel, ErrorModel } = require('../model/resModel');
const { checkLogin } = require('../controller/user')
const handleUserRouter = function(req, res) {
    
    if(req.method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body;
        const result = checkLogin(username, password);
        return result.then(bool => {
            if(bool) {
                return new SuccessModel('登陆成功');
            }else {
                return new ErrorModel('登录失败')
            }
        })
    }

}

module.exports = handleUserRouter;