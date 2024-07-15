const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const expressJWT = require('express-jwt')
const userModel = require('../model/userModel.js')
const crypto = require('crypto');
const common = require('../public/js/common.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const bili_ticket = require('../model/biliTicketCfg.js')
const client = require('../model/redisCfg.js');



// JWT密钥
const jwtKey = 'SnhAenIgseAl'



// cookie 配置
const cookieCfg = {
	httpOnly: true,
	sameSite: 'lax'
}



// 搜索歌曲
async function searchSong(req, res) {
	common.checkParams(req.query)
	const { keyword, songType } = req.query
	// console.log(keyword, songType)



	// 网易
	if (songType === '1') {
		try {
			let data = await fetch('http://localhost:3000/search?keywords=' + keyword)
			data = await data.json()
			data = data.result.songs

			// 连接歌曲id
			let songIdList = ''
			for (let i = 0; i < data.length; i++) {
				songIdList += data[i].id
				if (i < data.length - 1) {
					songIdList += ','
				}
			}

			// 加入背景图片url
			let imgData = await fetch('http://localhost:3000/song/detail?ids=' + songIdList)
			imgData = await imgData.json()
			for (let i = 0; i < data.length; i++) {
				data[i].imgUrl = imgData.songs[i].al.picUrl
			}

			res.json({
				code: 200,
				msg: '获取成功',
				songList: data
			})
		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}



		// 酷狗
	} else if (songType === '2') {
		try {
			let data = await fetch('http://songsearch.kugou.com/song_search_v2?keyword=' + keyword + '&page=1&pagesize=30')
			data = await data.json()
			data = data.data.lists

			// 背景图片替换size参数
			for (let i = 0; i < data.length; i++) {
				data[i].Image = data[i].Image.replace(/\{size\}/, /\//)
			}

			res.json({
				code: 200,
				msg: '获取成功',
				songList: data
			})
		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}



		// 酷我
	} else if (songType === '3') {
		try {
			const xhr = new XMLHttpRequest()
			xhr.open('GET', 'https://search.kuwo.cn/r.s?all=' + encodeURI(keyword) + '&ft=music&%20itemset=web_2013&client=kt&pn=0&rn=30&rformat=json&encoding=utf8', true)
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4 && xhr.status === 200) {

					// 这个返回的数据有点搞人，要把单引号换成双引号，再把&nbsp;换成空格字符
					let data = JSON.parse(xhr.responseText.replace(/'/g, '"').replace(/&nbsp;/gi, " "))
					data = data.abslist

					// 对背景图片url进行处理
					for (let i = 0; i < data.length; i++) {
						// console.log(data[i].web_albumpic_short)
						data[i].web_albumpic_short = `https://images.weserv.nl/?url=img2.kuwo.cn/star/albumcover/1${data[i].web_albumpic_short}`
					}

					res.json({
						code: 200,
						msg: '获取成功',
						songList: data
					})
				}
			}
			xhr.send()

		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}



		// 噼哩噼哩
	} else if (songType === '4') {
		try {
			let data = await fetch(`https://api.bilibili.com/x/web-interface/search/type?page=1&keyword=${keyword}&search_type=video`, {
				method: 'GET',
				headers: { 'Cookie': bili_ticket }
			})
			data = await data.json()
			data = await data.data.result

			// 去掉搜索关键词样式
			for (let i = 0; i < data.length; i++) {	
				data[i].title = data[i].title
								.split(`<em class="keyword">`).join("")
								.split(`</em>`).join("")
								.split(`&amp;`).join("&")
			}

			res.json({
				code: 200,
				msg: '获取成功',
				songList: data
			})
		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}
	}
}



// 获取音乐播放信息
async function playMusic(req, res) {
	common.checkParams(req.query)
	const { songId, songType } = req.query
	var songInfo = {
		songId: songId,
		songName: '',
		songAuthor: '',
		songImg: '',
		songUrl: '',
		songType: ''
	}



	// 网易云
	if (songType === '1') {
		try {
			let data = await fetch('http://localhost:3000/song/detail?ids=' + songId)
			data = await data.json()

			// songInfo.songId = parseInt(songInfo.songId)
			songInfo.songType = '1'
			songInfo.songName = data.songs[0].name
			songInfo.songAuthor = data.songs[0].ar[0].name
			songInfo.songImg = data.songs[0].al.picUrl
			songInfo.songUrl = 'http://music.163.com/song/media/outer/url?id=' + songId + '.mp3'

			res.json({
				code: 200,
				msg: '获取成功',
				songInfo: songInfo
			})
		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}



		// 酷狗
	} else if (songType === '2') {
		try {
			let data = await fetch('https://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=' + songId)
			data = await data.json()

			songInfo.songType = '2'
			songInfo.songName = data.songName
			songInfo.songAuthor = data.author_name
			songInfo.songImg = data.imgUrl.replace(/\{size\}/, 100)
			songInfo.songUrl = data.backup_url[0]

			res.json({
				code: 200,
				msg: '获取成功',
				songInfo: songInfo
			})
		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}



		// 酷我
	} else if (songType === '3') {
		try {
			// 这个有点搞人，获取歌曲信息和音乐播放链接的请求是分开的
			let getSongUrl = fetch('https://antiserver.kuwo.cn/anti.s?type=convert_url&rid=' + songId + '&format=mp3&response=url').then(res => res.text())
			// 歌曲信息的请求id参数只有数字
			let getSongData = fetch('http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=' + songId.replace('MUSIC_', '') + '&httpsStatus=1').then(res => res.json()).then(res => { return res.data.songinfo })

			Promise.all([getSongData, getSongUrl])
				.then(([songData, songUrl]) => {

					songInfo.songType = '3'
					songInfo.songName = songData.songName
					songInfo.songAuthor = songData.artist
					songInfo.songImg = songData.pic
					songInfo.songUrl = songUrl

					res.json({
						code: 200,
						msg: '获取成功',
						songInfo: songInfo
					})
				})
		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}



		// 噼哩噼哩
	} else if (songType === '4') {
		try {
			// 先获取aid和cid
			let data = await fetch(`https://bili.zhouql.vip/meta/${songId}`)
			data = await data.json()
			let aid = data.data.aid
			let cid = data.data.cid

			songInfo.songType = '4'
			songInfo.songImg = data.data.pic

			// 再获取视频播放地址
			let url = await fetch(`https://bili.zhouql.vip/download/${aid}/${cid}`)
			url = await url.json()
			songInfo.songUrl = url.data.durl[0].url

			res.json({
				code: 200,
				msg: '获取成功',
				songInfo: songInfo
			})

		} catch (err) {
			res.json({
				code: 500,
				msg: '获取失败' + err,
			})
		}
	}
}



/**
 * 加密密码，盐值随机数 + 原密码
 * 
 * @param password {str} 密码
 * @return {Object} 加密后的密码和盐
 */

function cryptPwd(password) {
	const salt = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
	return {
		password: crypto.createHash('md5').update(salt + password).digest('hex'),
		salt: salt
	}
}



/**
 * 将提交的密码和数据库里的密码进行比对
 * 
 * @param {str} password 提交的密码
 * @param {str} dtPassword 数据库用户密码
 * @param {str} salt 用户盐
 */

function cmpPwd(password, dtPassword, salt) {
	return dtPassword === crypto.createHash('md5').update(salt + password).digest('hex')
}



// 检查邮箱token
async function checkEmailToken(req, res) {
	const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : ''
	var isValidation

	if (token) {
		isValidation = await new Promise((resolve, reject) => {
			jwt.verify(token, jwtKey, (err, decoded) => {
				if (err) {
					res.json({
						code: 500,
						msg: "emailToken无效或已过期"
					})
					return
				} else {
					resolve(decoded)
				}
			})
		})
	} else {
		res.json({
			code: 0,
			msg: '邮箱尚未验证'
		})
		return
	}

	return isValidation.emailIsValidation
}



// 登录验证
async function login(req, res) {
	common.checkParams(req.body)
	const { account, password } = req.body

	const userInfo = await new Promise((resolve, reject) => {
		userModel.getUserByEmailOrName(account, (err, data) => {
			resolve(data[0])
		})
	})

	if (userInfo && cmpPwd(password, userInfo.password, userInfo.salt)) {
		const token = jwt.sign({ userInfo: userInfo }, jwtKey, { expiresIn: '30000s' })
		res.json({
			code: 200,
			success: true,
			msg: '登录成功',
			userToken: token
		})
	} else {
		res.json({
			code: 500,
			success: false,
			msg: '登录失败，用户名或密码错误',
		})
	}
}



// 注册时的邮箱验证
async function verifyRegister(req, res) {
	common.checkParams(req.body)
	const { email, code } = req.body

	if (await verifyEmailCode(email, code)) {
		const emailToken = jwt.sign({ emailIsValidation: 'true' }, jwtKey, { expiresIn: '120s' })
		res.json({
			code: 200,
			success: true,
			emailToken: emailToken,
			msg: '邮箱验证成功'
		})
	} else {
		res.json({
			code: 500,
			success: false,
			msg: '邮箱验证失败'
		})
	}
}



// 用户注册
async function register(req, res) {
	const isValidation = await checkEmailToken(req, res)
	console.log(req.body)
	common.checkParams(req.body)
	
	var { username, password, userDscrp, canSee, userImg } = req.body.info_1
	var { email } = req.body.info_2
	canSee = canSee ? 1 : 0
	var pwd = cryptPwd(password)

	userModel.addUser(username, pwd.salt, pwd.password, userImg, userDscrp, canSee, email, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '注册成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '注册失败'
			})
		}
	})
}



// 检查邮箱是否已被使用
async function checkEmailCanUse(email, res) {
	const data = await new Promise((resolve, reject) => {
		userModel.getEmail(email, (err, data) => {
			resolve(data[0])
		})
	})
	if (data) {
		return false
	}
	return true
}



// 检查用户名是否已被使用
async function checkUsername(req, res) {
	common.checkParams(req.query)
	const { username } = req.query

	const data = await new Promise((resolve, reject) => {
		userModel.getUsername(username, (err, data) => {
			resolve(data)
		})
	})

	if (data[0]) {
		res.json({
			code: 0,
			msg: '该用户名已被使用'
		})
	} else {
		res.json({
			code: 1,
			msg: '该用户名可使用'
		})
	}
}



// 发送邮箱验证码
async function sendEmailCode(req, res) {
	common.checkParams(req.query)
	const { email } = req.query

	if (await checkEmailCanUse(email, res)) {
		// 生成6位数验证码
		const code = parseInt(100000 + Math.random() * 899999)

		// 存储邮箱和验证码
		client.set('email', email)
		client.set('code', code.toString())

		if (common.sendEmailCode(email, code)) {
			res.json({
				code: 200,
				success: true,
				msg: '验证码发送成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '验证码发送失败'
			})
		}
	} else {
		res.json({
			code: 0,
			success: false,
			msg: '邮箱已被使用'
		})
	}
}



// 验证邮箱验证码
async function verifyEmailCode(email, code) {
	const redisEmail = await client.get('email')
	const redisCode = await client.get('code')

	if (redisEmail && email === redisEmail && code === redisCode) {
		return true
	}
	return false
}



// 获取自己用户信息
async function getSelf(req, res) {
	const user = await common.checkToken(req, res)

	res.json({
		code: 200,
		success: true,
		msg: '获取成功',
		user: user
	})
}



// 获取自己用户播放列表
async function getSelfPlaylist(req, res) {
	const user = await common.checkToken(req, res)

	const playlist = await new Promise((resolve, reject) => {
		userModel.getUserPlaylist(user.userId, (err, data) => {
			resolve(data)
		})
	})

	res.json({
		code: 200,
		msg: '获取成功',
		data: playlist
	})
}



// 获取自己主页信息
async function getHomeInfo(req, res) {
	const user = await common.checkToken(req, res)

	const getUserInfo = new Promise((resolve, reject) => {
		userModel.getUserInfoById(user.userId, (err, data) => {
			resolve(data[0])
		})
	})
	const getAlbumList = new Promise((resolve, reject) => {
		userModel.getUserAlbum(user.userId, (err, data) => {
			resolve(data)
		})
	})
	const [userInfo, albumList] = await Promise.all([getUserInfo, getAlbumList])

	res.json({
		code: 200,
		msg: '获取成功',
		data: {
			userInfo: userInfo,
			albumList: albumList
		}
	})
}



// 获取其他用户的主页信息
async function getUserProfileInfo(req, res) {
	common.checkParams(req.query)
	const { username } = req.query

	const getUserInfo = new Promise((resolve, reject) => {
		userModel.getUserInfoByName(username, (err, data) => {
			resolve(data[0])
		})
	})
	const getAlbumList = new Promise((resolve, reject) => {
		userModel.getUserAlbumByName(username, (err, data) => {
			resolve(data)
		})
	})
	const [ userInfo, albumList ] = await Promise.all([getUserInfo, getAlbumList])

	if (userInfo && !userInfo.canSee) {
		res.json({
			code: 0,
			msg: '该用户因隐私设置主页不可访问'
		})
		return
	}

	res.json({
		code: 200,
		success: true,
		msg: '获取成功',
		data: {
			userInfo: userInfo,
			albumList: albumList
		}
	})
}



// 更新用户信息
async function updateUser(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	var { username, userDscrp, canSee, userImg } = req.body.editFrom
	canSee = canSee === true ? 1 : 0

	userModel.updateUser(user.userId, username, userDscrp, canSee, userImg, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				userInfo: await new Promise((resolve, reject) => {
					userModel.getUserInfoById(user.userId, (err, data) => {
						resolve(data[0])
					})
				}),
				msg: '信息更新成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '信息更新失败'
			})
		}
	})
}



// 更改密码
async function setPwd(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	const { password, repassword } = req.body

	if (password !== repassword) {
		res.json({
			code: 501,
			msg: '两次输入密码不一致'
		})
		return
	}

	// 加密密码
	const pwd = cryptPwd(password)
	userModel.setPwd(pwd.password, pwd.salt, user.userId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '密码更改成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '密码更改失败'
			})
		}
	})
}



// 修改邮箱
async function setEmail(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	const { email, code } = req.body

	if (await verifyEmailCode(email, code)) {
		userModel.setEmail(email, user.userId, (err, data) => {
			if (!err) {
				res.json({
					code: 200,
					success: true,
					msg: '邮箱修改成功'
				})
			} else {
				res.json({
					code: 500,
					success: false,
					msg: '邮箱修改失败'
				})
			}
		})
	} else {
		res.json({
			code: 0,
			success: false,
			msg: '邮箱验证码错误或过期'
		})
	}
}



// 注销账号
async function remake(req, res) {
	const user = await common.checkToken(req, res)
	common.checkParams(req.body)
	const { txt } = req.body.remakeForm

	if (txt !== '我确认注销账号') {
		res.json({
			code: 500,
			success: false,
			msg: '确认信息不正确'
		})
		return
	}

	userModel.remake(user.userId, (err, data) => {
		if (!err) {
			res.json({
				code: 200,
				success: true,
				msg: '账号注销成功'
			})
		} else {
			res.json({
				code: 500,
				success: false,
				msg: '账号注销失败'
			})
		}
	})
}



const userController = {
	searchSong,
	playMusic,
	checkEmailToken,
	login,
	verifyRegister,
	register,
	checkEmailCanUse,
	checkUsername,
	sendEmailCode,
	verifyEmailCode,
	getSelfPlaylist,
	getSelf,
	getHomeInfo,
	getUserProfileInfo,
	updateUser,
	setPwd,
	setEmail,
	remake
}
module.exports = userController
