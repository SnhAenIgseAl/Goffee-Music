const createError = require('http-errors');
const express = require('express');
const cookie = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const expressJWT = require('express-jwt')
const bodyParser = require('body-parser')
const router = require('./router')



const app = express();



app.use(session({
	secret: 'SAhneAInsgNeolt',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 2 * 60 * 1000}
}))
app.use(cookie())
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));



// 跨域
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization')
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})



// 路由配置
app.use(router)



// 服务器监听
const port = 18848;
app.listen(port, () => {
	console.log('http://127.0.0.1:' + port);
})



app.use(function (req, res, next) {
	next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});



module.exports = app;