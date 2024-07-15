const express = require('express')
const userController = require('./controller/userController')
const albumController = require('./controller/albumController')
const adminController = require('./controller/adminController')
// const manageController = require('./controller/manageController')
const router = express.Router()
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})



// 测试接口
router.get('/', (req, res) => {
	const query = req.query
	const params = req.params

	res.json({
		code: 200,
		msg: '扣1送网抑云黑胶会员',
		data: {
			query: query,
			params: params
		}
	})
})



router.get('/serch', userController.searchSong)
router.get('/playmusic', userController.playMusic)
router.post('/login', userController.login)
router.post('/api/verifyRegister', userController.verifyRegister)
router.post('/register', userController.register)
// router.get('/api/cheakEmail', userController.checkEmail)
router.get('/api/cheakUsername', userController.checkUsername)
router.get('/api/getEmailCode', userController.sendEmailCode)
router.post('/api/verifyEmail', userController.verifyEmailCode)
router.get('/self', userController.getSelf)
router.get('/home', userController.getHomeInfo)
router.get('/profile', userController.getUserProfileInfo)
router.post('/api/update', userController.updateUser)
router.post('/api/setPwd', userController.setPwd)
router.post('/api/setEmail', userController.setEmail)
router.post('/remake', userController.remake)
router.get('/self/album', albumController.getSelfAlbumInfoById)
router.get('/album', albumController.getAlbumInfo)
router.get('/playlist', userController.getSelfPlaylist)
router.post('/addAlbum', albumController.addAlbum)
router.post('/updateAlbum', albumController.updateAlbum)
router.get('/delAlbum', albumController.delAlbum)
router.get('/share', albumController.shareAlbum)
router.post('/api/like', albumController.like)
router.post('/api/dislike', albumController.dislike)



router.get('/api/admin/total', adminController.getTotal)
router.get('/api/admin/reviewAlbum', adminController.getReviewAlbums)
router.get('/api/admin/albumList' ,adminController.getAlbums)
router.get('/api/admin/albumSongs' ,adminController.getApproveAlbumSongs)
router.post('/api/admin/approve' ,adminController.approveAlbum)
router.post('/api/admin/against' ,adminController.againstAlbum)
router.get('/api/admin/userList', adminController.getUsers)
router.post('/api/admin/ban' ,adminController.banUser)
router.post('/api/admin/unban' ,adminController.unbanUser)
router.get('/api/admin/history', adminController.getManageHistory)



module.exports = router