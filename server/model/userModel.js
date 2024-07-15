const mysql = require('mysql')
const cfg = require('./mysqlCfg');
const connection = mysql.createConnection(cfg)



//测试数据库连接是否成功
connection.query("select 1", (err, results) => {
	if (err) {
		return console.log(err);
	}

	console.log('userModel' + results);
});



// 根据用户名或邮箱判断用户是否存在
async function getUserByEmailOrName(username, callback) {
	var sql = `SELECT * FROM users WHERE users.username = ? OR users.email = ?`
	connection.query(sql, [username, username], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 检查邮箱是否已被使用
async function getEmail(email, callback) {
	var sql = `SELECT users.email FROM users WHERE email = ?`
	connection.query(sql, [email], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 根据用户Id获取邮箱
async function getEmailById(userId, callback) {
	var sql = `SELECT users.email FROM users WHERE userId = ?`
	connection.query(sql, [userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 检查用户名是否已被使用
async function getUsername(username, callback) {
	var sql = `SELECT users.username FROM users WHERE username = ?`
	connection.query(sql, [username], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 新增用户
async function addUser(username, salt, password, userImg, userDscrp, canSee, email, callback) {
	var sql = `
		INSERT INTO users (username, email, salt, password) VALUES (?, ?, ?, ?);
		INSERT INTO userinfo (username, userImg, userDscrp, canSee) VALUES (?, ?, ?, ?);
	`
	connection.query(sql, [username, email, salt, password, username, userImg, userDscrp, canSee], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 获取用户基本信息
async function getUserInfoById(userId, callback) {
	var sql = `SELECT * FROM userInfo WHERE userId = ?`
	connection.query(sql, [userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
async function getUserInfoByName(username, callback) {
	var sql = `SELECT * FROM userInfo WHERE username = ?`
	connection.query(sql, [username], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 获取用户创建的歌单
async function getUserAlbum(userId, callback) {
	var sql = `SELECT * FROM albums WHERE createdById = ?`
	connection.query(sql, [userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
async function getUserAlbumByName(username, callback) {
	var sql = `SELECT * FROM albums WHERE createdBy = ?`
	connection.query(sql, [username], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 更新用户信息
async function updateUser(userId, username, userDscrp, canSee, userImg, callback) {
	var sql = `
		UPDATE userinfo SET username = ?, userDscrp = ?, canSee = ?, userImg = ? WHERE userId = ?;
		UPDATE users SET username = ? WHERE userId = ?;
		UPDATE albums SET createdBy = ? WHERE createdById = ?;
	`
	connection.query(sql, [username, userDscrp, canSee, userImg, userId, username, userId, username, userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 更改密码
async function setPwd(password, salt, userId, callback) {
	var sql = `UPDATE users SET password = ?, salt = ? WHERE userId=?`
	connection.query(sql, [password, salt, userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 更改邮箱
async function setEmail(email, userId, callback) {
	var sql = `UPDATE users SET email = ? WHERE userId=?`
	connection.query(sql, [email, userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 账号注销
async function remake(userId, callback) {
	var sql = `
		DELETE FROM users WHERE userId = ?;
		DELETE FROM userinfo WHERE userId = ?;
		DELETE FROM albums, albumSongs WHERE albums.albumId = albumSongs.albumId AND albums.albumId = ?;
	`
	connection.query(sql, [userId, userId, userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



const userModel = {
	getUserByEmailOrName,
	getEmail,
	getEmailById,
	getUsername,
	addUser,
	getUserInfoById,
	getUserInfoByName,
	getUserAlbum,
	getUserAlbumByName,
	updateUser,
	setPwd,
	setEmail,
	remake
}
module.exports = userModel