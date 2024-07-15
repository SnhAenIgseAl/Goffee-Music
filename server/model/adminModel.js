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



// 检查权限等级
async function getUserRankById(userId, callback) {
	var sql = `SELECT * FROM users WHERE userId = ?`
	connection.query(sql, [userId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}




// 获取所有歌单
async function getAlbums(callback) {
	var sql = `SELECT * FROM albums`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 获取所有审核中的歌单
async function getReviewAlbums(callback) {
	var sql = `SELECT * FROM albums WHERE status = 0`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 获取所有修改中的歌单
async function getAlterAlbums(callback) {
	var sql = `SELECT * FROM albums WHERE status = -1`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 获取所有审核通过的歌单
async function getApproveAlbums(callback) {
	var sql = `SELECT * FROM albums WHERE status = 1`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 获取歌单歌曲
async function getAlbumSongs(albumId, callback) {
	var sql = `SELECT albums.*, albumsongs.* FROM albums, albumsongs WHERE albums.albumId = albumsongs.albumId AND albums.albumId = ?`
	connection.query(sql, [albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 审核通过歌单
async function setAlbumToPass(albumId, callback) {
	var sql = `UPDATE albums SET status = 1, reason = NULL WHERE albumId = ?`
	connection.query(sql, [albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 审核不通过歌单
async function setAlbumToReject(reason, albumId, callback) {
    var sql = `UPDATE albums SET status = -1, reason = ? WHERE albumId = ?`
	connection.query(sql, [reason, albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 获取所有普通用户
async function getUsers(callback) {
    var sql = `SELECT users.*, userinfo.* FROM users, userinfo WHERE users.userId = userinfo.userId AND userRank = 1`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}
// 获取所有被封禁的用户
async function getBanUsers(callback) {
	var sql = `SELECT users.*, userinfo.* FROM users, userinfo WHERE users.userId = userinfo.userId AND status = -1`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 封禁用户
async function banUser(reason, userId, callback) {
	var sql = `UPDATE users SET status = -1, reason = ? WHERE userId = ?`
	connection.query(sql, [reason, userId], (err, data) => {
	    if (err) throw err
		callback && callback(err, data)
	})
}



// 解封用户
async function unbanUser(userId, callback) {
	var sql = `UPDATE users SET status = 1, reason = NULL WHERE userId = ?`
	connection.query(sql, [userId], (err, data) => {
	    if (err) throw err
		callback && callback(err, data)
	})
}



// 获取管理历史记录
async function getManageHistory(callback) {
	var sql = `SELECT * FROM manageHistory ORDER BY mngId DESC`
	connection.query(sql, (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 更新管理历史记录
async function updateManageHistory(userId, username, type, targetId, time, reason, callback) {
	console.log(userId, username, type, targetId, time, reason)
	// var sql = `INSERT INTO manageHistory (userId, username, type, targetId, time, reason) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), ?)`
	var sql = `INSERT INTO manageHistory (userId, username, type, targetId, time, reason) VALUES (?, ?, ?, ?, ?, ?)`
	connection.query(sql, [userId, username, type, targetId, time, reason], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



const adminModel = {
	getUserRankById,
	getAlbums,
	getReviewAlbums,
	getAlterAlbums,
	getApproveAlbums,
	getAlbumSongs,
	setAlbumToPass,
	setAlbumToReject,
	getUsers,
	getBanUsers,
	banUser,
	unbanUser,
	getManageHistory,
	updateManageHistory
}
module.exports = adminModel