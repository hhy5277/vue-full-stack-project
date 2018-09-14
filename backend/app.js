/*
 * @Author: xypecho
 * @Date: 2018-09-08 21:45:02
 * @Last Modified by: xueyp
 * @Last Modified time: 2018-09-14 17:14:00
 */
const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();
const user = require('./api/user/user');// 用户信息的接口
const upload = require('./api/upload/upload');// 上传相关的接口

/* 文件上传相关 */
const multer = require('koa-multer');//加载koa-multer模块
const path = require('path');
const static = require('koa-static');
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'upload/images/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var uploadMiddleware = multer({ storage: storage });

//设置静态资源的路径
app.use(static(__dirname + '/upload/images'));

/* 文件上传相关 */

app.use(bodyParser());

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        } else {
            return 'http://localhost:8080'; // 这样就能只允许 http:/ / localhost: 8080 这个域名的请求了
        }
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

router
    .get('/', async (ctx) => {
        console.log(ctx)
        ctx.body = 'hello world';
    })
    .post('/api/user/login', user.login)
    .post('/api/user/register', user.register)
    .post('/api/user/list', user.list)
    .post('/api/user/edit', user.edit)
    .get('/api/user/userInfo', user.userInfo)
    .post('/api/upload/image', uploadMiddleware.single('file'), upload.image)
app.use(router.routes()).use(router.allowedMethods());

app.listen(8081, () => {
    console.log('koa starts at port 8081!');
})