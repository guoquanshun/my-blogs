const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { set, get } = require('./src/db/redis')
const { access } = require('./src/utils/log');

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if(req.method !== 'POST') {
            resolve({});
            return;
        }
        if(req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }
        let postData;
        req.on('data', chunk => {
            postData = chunk.toString();
        })
        req.on('end', () => {
            if(!postData) {
                resolve({})
                return;
            }
            resolve(
                JSON.parse(postData)
            )
        })
    });
    return promise;
}

const serverHandle = (req, res) => {

    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);

    res.setHeader('Content-type', 'application/json');

    const url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1]);

    // 解析cookie
    req.cookie = {};
    const cookieString = req.headers.cookie || '';
    cookieString.split(';').forEach(i => {
        if(!i) return;
        const arr = i.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    });

    let needSetCookie = false;
    let userId = req.cookie.userid;
    if(!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`
        set(userId, {})
    }
    req.sessionId = userId;
    
    get(req.sessionId).then(sessionData => {
        console.log('sessionData', sessionData);
        if(sessionData == null) {
            set(req.sessionId, {})
            req.session = {};
        }else {
            req.session = sessionData;
        }
        return getPostData(req)
    }).then(postData => {
        // console.log('postData', postData);
        req.body = postData;
        
        const blogResult = handleBlogRouter(req, res);
        if(blogResult) {
            blogResult.then(blogData => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return;
        }

        const userResult = handleUserRouter(req, res);
        if(userResult) {
            userResult.then(userData => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return;
        }
        res.writeHead(404, {"Content-type": 'text/plain'});
        res.write('404 not Found\n')
        res.end()
    })
}

module.exports = serverHandle;

// process.env.NODE_ENV