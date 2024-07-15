const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const emailCfg = require('../../model/emailCfg')
// const client = require('server/model/redisCfg.js')



// JWT密钥
const jwtKey = 'SnhAenIgseAl'



// 配置邮箱
const transporter = nodemailer.createTransport({
	service: 'qq',
	host: 'smtp.qq.com',
	port: 456,
	secure: true,
	auth: {
		user: emailCfg.user,
		pass: emailCfg.pass
	}
})



// 检查用户token
async function checkToken(req, res) {
	const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : ''
	var user

	if (token) {
		user = await new Promise((resolve, reject) => {
			jwt.verify(token, jwtKey, (err, decoded) => {
				if (err) {
					res.json({
						code: 500,
						msg: "token无效或已过期"
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
			msg: '尚未登录'
		})
		return
	}

	// console.log(user.userInfo)
	return user.userInfo
}



// 检查参数
function checkParams(params) {
	console.log(params)
	if (!params) {
		res.json({
			code: 0,
			success: false,
			msg: '缺少参数'
		})
		return
	}
}



// 发送邮箱验证码
async function sendEmailCode(email, code) {
	try {
		transporter.sendMail({
			from: emailCfg.user,
			to: email,
			subject: 'Goffee Music',
			text: `【Goffee Music】验证码 | ${code}。如非本人操作，请忽略。`,
		})
		return true
	} catch (err) {
		return false
	}
}



// 给用户发送邮件
async function sendEmailInform(info, email) {
	try {
		transporter.sendMail({
			from: emailCfg.user,
			to: email,
			subject: 'Goffee Music',
			text: `【Goffee Music】 ${info}`,
		})
		return true
	} catch (err) {
		return false
	}
}


const common = {
	checkToken,
	checkParams,
	sendEmailCode,
	sendEmailInform
}
module.exports = common