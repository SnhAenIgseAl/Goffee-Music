const common = require('../public/js/common.js')
const userModel = require('../model/userModel');
const adminModel = require('../model/adminModel');



/**
 * 管理员操作类型
 * 歌单管理位，1为审核通过，-1为退回
 * 用户管理位，1为封禁，1为解禁
 */
const APPROVE_ALBUM = 'A1'
const AGAINST_ALBUM = 'A-1'
const BAN_USER = 'U-1'
const UNBAN_USER = 'U1'



// 检查管理员权限
async function checkRank(req, res) {
	const user = await common.checkToken(req, res)
	adminModel.getUserRankById(user.userId, (err, data) => {
		if (data[0].userRank === 1) {
			res.json({
				code: 0,
				msg: '你是？'
			})
			return
		}
	})
	return user
}



// 获取所有歌单各状态数量
async function getTotal(req, res) {
	const user = await checkRank(req, res)

	const getApproveAlbums = new Promise((resolve, reject) => {
		adminModel.getApproveAlbums((err, data) => {
			resolve(data.length)
		})
	})
	const getAlterAlbums = new Promise((resolve, reject) => {
	    adminModel.getAlterAlbums((err, data) => {
			resolve(data.length)
		})
	})
	const getReviewAlbums = new Promise((resolve, reject) => {
	    adminModel.getReviewAlbums((err, data) => {
			resolve(data.length)
		})
	})
	const [ approveNum, 
			alterNum, 
			reviewNum,
			// newUserNum,
			banUserNum,
			userNum,
	] = await Promise.all([ 
		new Promise((resolve, reject) => {
			adminModel.getApproveAlbums((err, data) => {
				resolve(data.length)
			})
		}),
		new Promise((resolve, reject) => {
			adminModel.getAlterAlbums((err, data) => {
				resolve(data.length)
			})
		}),
		new Promise((resolve, reject) => {
			adminModel.getReviewAlbums((err, data) => {
				resolve(data.length)
			})
		}),
			// userModel.getNewUsers((err, data) => {
			// 	resolve(data.length)
			// }),
		new Promise((resolve, reject) => {
			adminModel.getBanUsers((err, data) => {
				resolve(data.length)
			})
		}),
		new Promise((resolve, reject) => {
			adminModel.getUsers((err, data) => {
				resolve(data.length)
			})
		})
		// getAlterAlbums, 
		// getReviewAlbums 
	])

	res.json({
		code: 200,
		success: true,
		msg: '获取成功',
		data: {
		    approve: approveNum,
			alter: alterNum,
			review: reviewNum,
			// newUser: newUserNum,
			banUser: banUserNum,
			user: userNum
		}
	})
}



// 获取所有审核中的歌单
async function getReviewAlbums(req, res) {
	await checkRank(req, res)

	adminModel.getReviewAlbums((err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '获取成功',
				data: data
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '获取失败'
			})
		}
	})
}



// 获取所有歌单
async function getAlbums(req, res) {
	await checkRank(req, res)

	adminModel.getAlbums((err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '获取成功',
				data: data
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '获取失败'
			})
		}
	})
}



// 获取所有审核通过歌单的歌曲
async function getApproveAlbumSongs(req, res) {
	const user = await checkRank(req, res)

	const albumList = await new Promise((resolve, reject) => {
		adminModel.getApproveAlbums((err, data) => {
			resolve(data)
		})
	})
	
	for (let i = 0; i < albumList.length; i++) {
		albumId = albumList[i].albumId
		albumList[i].songList = await new Promise((resolve, reject) => {
			adminModel.getAlbumSongs(albumId, (err, data) => {
				resolve(data)
			})
		})
	}

	res.json({
		code: 200,
		success: true,
		msg: '获取成功',
		data: albumList
	})
}



// 审核通过歌单
async function approveAlbum(req, res) {
	const user = await checkRank(req, res)
	const { albumInfo } = req.body

	adminModel.setAlbumToPass(albumInfo.albumId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '审核通过成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '审核通过失败'
			})
		}
	})

	// 发送邮件通知用户
	const email = await new Promise((resolve, reject) => {
		userModel.getEmailById(albumInfo.createdById, (err, data) => {
			resolve(data[0].email)
		})
	})
	common.sendEmailInform(`您的歌单【${albumInfo.albumName}】审核已通过`, email)

	updateManageHistory(user.userId, user.username, APPROVE_ALBUM, albumInfo.albumId, getTime())
}



// 审核不通过歌单
async function againstAlbum(req, res) {
	const user = await checkRank(req, res)
	const { reason, albumInfo } = req.body

	adminModel.setAlbumToReject(reason, albumInfo.albumId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '歌单退回成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '歌单退回失败'
			})
		}
	})

	// 发送邮件通知用户
	const email = await new Promise((resolve, reject) => {
		userModel.getEmailById(albumInfo.createdById, (err, data) => {
			resolve(data[0].email)
		})
	})
	common.sendEmailInform(`您的歌单【${albumInfo.albumName}】审核未通过，原因：${reason}`, email)

	updateManageHistory(user.userId, user.username, AGAINST_ALBUM, albumInfo.albumId, getTime(), reason)
}


// 获取所有普通用户
async function getUsers(req, res) {
	await checkRank(req, res)

	adminModel.getUsers((err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '获取成功',
				data: data
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '获取失败'
			})
		}
	})
}



// 封禁用户
async function banUser(req, res) {
	const user = await checkRank(req, res)
	const { reason, time, userId } = req.body
	console.log(req.body)

	adminModel.banUser(reason, userId, (err, data) => {
	    if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '封禁成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '封禁失败'
			})
		}
	})

	// 发送邮件通知用户
	const email = await new Promise((resolve, reject) => {
		userModel.getEmailById(userId, (err, data) => {
			resolve(data[0].email)
		})
	})
	common.sendEmailInform(`您的账号已被封禁${time}天，原因：${reason}`, email)

	// 时间到了自动解封
	setTimeout(() => {
		adminModel.unbanUser(userId)
	}, 1000 * 60 * 60 * 24 * time)

	updateManageHistory(user.userId, user.username, BAN_USER, userId, getTime(), reason)
}



// 解封用户
async function unbanUser(req, res) {
	const user = await checkRank(req, res)
	const { userId } = req.body

	adminModel.unbanUser(userId, (err, data) => {
	    if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '解封成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '解封失败'
			})
		}
	})

	const email = await new Promise((resolve, reject) => {
		userModel.getEmailById(userId, (err, data) => {
			resolve(data[0].email)
		})
	})
	common.sendEmailInform(`您的账号已被解封`, email)

	updateManageHistory(user.userId, user.username, UNBAN_USER, userId, getTime())
}



// 获取管理历史记录
async function getManageHistory(req, res) {
	await checkRank(req, res)

	adminModel.getManageHistory((err, data) => {
	    if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '获取成功',
				data: data
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '获取失败'
			})
		}
	})
}



// 更新管理历史记录
function updateManageHistory(userId, username, type, targetId, time, reason) {
	adminModel.updateManageHistory(userId, username, type, targetId, time, reason)
}



// 获取秒级时间戳
function getTime() {
	let time = Date.now().toString()
	time = time.substring(0, time.length - 3)
	return parseInt(time)
}



const adminController = {
	getTotal,
	getReviewAlbums,
	getAlbums,
	getApproveAlbumSongs,
	approveAlbum,
	againstAlbum,
	getUsers,
	banUser,
	unbanUser,
	getManageHistory
}
module.exports = adminController