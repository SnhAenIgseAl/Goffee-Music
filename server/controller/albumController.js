const albumModel = require('../model/albumModel.js');
const userModel = require('../model/userModel.js');
const common = require('../public/js/common.js');



// 获取自己创建的歌单信息
async function getSelfAlbumInfoById(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.query)
	const { albumId } = req.query

	const getAlbumInfo = new Promise((resolve, reject) => {
		albumModel.getAlbumInfoById(albumId, (err, data) => {
		    resolve(data)
		})
	})
	const getAlbumSongs = new Promise((resolve, reject) => {
	    albumModel.getAlbumSongsById(albumId, (err, data) => {
		    resolve(data)
		})
	})
	const [ albumInfo, albumSongs ] = await Promise.all([getAlbumInfo, getAlbumSongs])

	if ((albumInfo && albumInfo[0].createdById !== user.userId)) {
		res.json({
			code: 0,
			msg: ''
		})
		return
	}

	res.json({
		code: 200,
		success: true,
		msg: '获取成功',
		data: {
		    albumInfo: albumInfo,
			albumSongs: albumSongs
		}
	})
}



// 获取歌单信息
async function getAlbumInfo(req, res) {
	common.checkParams(req.query)
	const { albumId } = req.query

	const getAlbumInfo = new Promise((resolve, reject) => {
		albumModel.getAlbumInfoById(albumId, (err, data) => {
		    resolve(data)
		})
	})
	const getAlbumSongs = new Promise((resolve, reject) => {
	    albumModel.getAlbumSongsById(albumId, (err, data) => {
		    resolve(data)
		})
	})
	const [ albumInfo, albumSongs ] = await Promise.all([getAlbumInfo, getAlbumSongs])

	if ((albumInfo && !albumInfo[0].canSee)) {
		res.json({
			code: 0,
			msg: '该歌单因隐私设置不可访问'
		})
		return
	}

	res.json({
		code: 200,
		success: true,
		msg: '获取成功',
		data: {
		    albumInfo: albumInfo,
			albumSongs: albumSongs
		}
	})
}



// 新建歌单
async function addAlbum(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	var { albumName, albumDscrp, canSee, albumImg } = req.body.editFrom
	canSee = canSee === true ? 1 : 0
	
	albumModel.addAlbum(albumName, user.username, albumImg, albumDscrp, canSee, user.userId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '创建歌单成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '创建歌单失败'
			})
		}
	})
}



// 更新歌单
async function updateAlbum(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	var { albumId, albumName, albumDscrp, canSee, albumImg } = req.body.editFrom
	canSee = canSee === true ? 1 : 0

	albumModel.updateAlbum(albumId, albumName, albumDscrp, canSee, albumImg, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '歌单更新成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '歌单更新失败'
			})
		}
	})
}



// 删除歌单
async function delAlbum(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.query)
	const { albumId } = req.query

	const createdById = await new Promise((resolve, reject) => {
		albumModel.getAlbumInfoById(albumId, (err, data) => {
			resolve(data[0].createdById)
		})
	})
	if (createdById !== user.userId) {
		res.json({
			code: 500,
			msg: '不能删除别人的歌单'
		})
		return
	}

	albumModel.delAlbum(albumId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				msg: '歌单删除成功'
			})
		} else {
			res.json({
				code: 500,
				msg: '歌单删除失败'
			})
		}
	})
}



// 分享歌单
async function shareAlbum(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.query)
	const { albumId } = req.query

	const getAlbumInfo = new Promise((resolve, reject) => {
		albumModel.getAlbumInfoById(albumId, (err, data) => {
			resolve(data[0])
		})
	})
	const getUserImg = new Promise((resolve, reject) => {
		userModel.getUserInfoById(user.userId, (err, data) => {
			resolve(data[0].userImg)
		})
	})
	const [ albumInfo, userImg ] = await Promise.all([getAlbumInfo, getUserImg])

	if (albumInfo) {
		res.json({
			code: 200,
			msg: '获取成功',
			data: {
				albumInfo: albumInfo,
				userImgUrl: userImg
			}
		})
	} else {
		res.json({
			code: 404,
			msg: '获取失败，歌单不存在',
		})
	}
}



// 收藏歌曲至歌单
async function like(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	const { albumId, songId, songName, songImg, songType} = req.body
	// console.log(req.body)

	albumModel.addSongToAlbum(albumId, songId, songName, songImg, songType, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				msg: '成功收藏歌曲'
			})
		} else {
			res.json({
				code: 500,
				msg: '收藏歌曲失败'
			})
		}
	})
}



// 歌单删除歌曲
async function dislike(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	const { songId, albumId } = req.body

	albumModel.delSongFromAlbum(songId, albumId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '删除歌曲成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '删除歌曲失败'
			})
		}
	})
}



const albumController = {
	getSelfAlbumInfoById,
    getAlbumInfo,
	addAlbum,
	updateAlbum,
	delAlbum,
	shareAlbum,
	like,
	dislike
}
module.exports = albumController