const mysql = require('mysql')
const cfg = require('./mysqlCfg');
const connection = mysql.createConnection(cfg)



//测试数据库连接是否成功
connection.query("select 1", (err, results) => {
	if (err) {
		return console.log(err);
	}

	console.log('albumModel' + results);
});



// 获取歌单信息
async function getAlbumInfoById(albumId, callback) {
    var sql = `SELECT * FROM albums WHERE albumId = ?`
	connection.query(sql, [albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 获取歌单歌曲
async function getAlbumSongsById(albumId, callback) {
	var sql = `SELECT * FROM albumsongs WHERE albumId = ?`
	connection.query(sql, [albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 新建歌单
async function addAlbum(albumName, createdBy, albumImg, albumDscrp, canSee, createdById, callback) {
	var sql = `INSERT INTO albums (albumName, createdBy, albumImg, albumDscrp, canSee, status, createdById) VALUES (?, ?, ?, ?, ?, 0, ?)`
	connection.query(sql, [albumName, createdBy, albumImg, albumDscrp, canSee, createdById], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 更新歌单
async function updateAlbum(albumId, albumName, albumDscrp, canSee, albumImg, callback) {
	var sql = `UPDATE albums SET albumName = ?, albumDscrp = ?, canSee = ?, albumImg = ?, status = 0 WHERE albumId = ?`
	connection.query(sql, [albumName, albumDscrp, canSee, albumImg, albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 删除歌单
async function delAlbum(albumId, callback) {
	var sql = `
		DELETE FROM albums WHERE albumId = ?;
		DELETE FROM albumsongs WHERE albumId = ?;
	`
	connection.query(sql, [albumId, albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 收藏歌曲
async function addSongToAlbum(albumId, songId, songName, songImg, songType, callback) {
	var sql = `INSERT INTO albumsongs (albumId, songId, songName, songImg, songType) VALUES (?, ?, ?, ?, ?)`
	connection.query(sql, [albumId, songId, songName, songImg, songType], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}



// 歌单删除歌曲
async function delSongFromAlbum(songId, albumId, callback) {
	var sql = `DELETE FROM albumsongs WHERE songId = ? AND albumId = ?`
	connection.query(sql, [songId, albumId], (err, data) => {
		if (err) throw err
		callback && callback(err, data)
	})
}


const albumModel = {
	getAlbumInfoById,
	getAlbumSongsById,
	addAlbum,
	updateAlbum,
	delAlbum,
	addSongToAlbum,
	delSongFromAlbum
}
module.exports = albumModel
