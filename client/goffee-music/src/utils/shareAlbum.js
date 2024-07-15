import serverCfg from "./serverCfg"

const shareAlbum = {
	async install(albumId, shareAlbum) {

		// 获取歌单信息
		const data = await new Promise((resolve, reject) => {
			fetch(`${serverCfg.host}${serverCfg.port}/share?albumId=${albumId}`, {
				headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
			})
				.then(data => data.json())
				.then(data => {
					resolve(data.data)
				})
		})
		const { albumInfo, userImgUrl } = data

		// 初始化
		var context = shareAlbum.getContext("2d")
		shareAlbum.width = 1080;
		shareAlbum.height = 1800;

		// 清空画布
		context.rect(0, 0, shareAlbum.width, shareAlbum.height)
		context.fill()

		// 歌单背景图片，等比放大高度至1440像素，居中
		var albumImg = new Image()
		albumImg.src = `https://images.weserv.nl/?url=${albumInfo.albumImg}`
		const drawAlbumImg = new Promise(async () => {
			albumImg.onload = () => {
				// 计算缩放比例
				let scale = 1440 / albumImg.naturalHeight
				albumImg.width = albumImg.naturalWidth * scale
				albumImg.height = 1440

				// 计算位置
				let x = (shareAlbum.width / 2) - (albumImg.width / 2)
				context.drawImage(albumImg, x, 0, albumImg.width, albumImg.height)
			}

			// 歌单文字背景
			var textShadow = new Image()
			textShadow.src = `https://images.weserv.nl/?url=https://i.ibb.co/FJjZd0d/share-album-shadow.png`
			textShadow.onload = () => {
				context.drawImage(textShadow, 0, 810)

				context.font = "60px 方正兰亭黑";
				context.fillStyle = '#FFF'
				context.fillText(albumInfo.createdBy + "分享了歌单", 60, 1200);

				// 歌单标题
				context.font = "bold 90px 方正兰亭黑";
				context.fillStyle = '#FFF'
				context.fillText(albumInfo.albumName, 60, 1350);
			}

			// 歌单创建者头像
			var userImg = new Image()
			userImg.src = userImgUrl
			userImg.onload = () => {

				// 圆形遮罩
				context.save();
				context.beginPath();
				context.fillStyle = '#FFF'
				context.arc(150, 990, 90, 0, 2 * Math.PI)
				context.fill()
				context.clip()

				// 计算头像缩放倍率
				let scale = 180 / userImg.naturalHeight
				userImg.width = userImg.naturalWidth * scale
				userImg.height = 180

				// 计算位置
				let x = 150 - (userImg.width / 2)
				context.drawImage(userImg, x, 900, userImg.width, userImg.height)
				context.restore()
			}
		})



		// 歌单底部图片
		var bottomImg = new Image()
		bottomImg.src = `https://images.weserv.nl/?url=https://i.ibb.co/QQRTYVG/share-album-bottom.png`
		const drawBottom = new Promise(() => {
			bottomImg.onload = () => {
				context.drawImage(bottomImg, 0, 1440)
			}

			// 二维码
			var qrImg = new Image()
			qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&qzone=2&data=https://${window.location.hostname}/%23/album/${albumInfo.albumId}`
			qrImg.onload = () => {
				context.drawImage(qrImg, 1, 1, 208, 208, 765, 1515, 210, 210)
			}
		})



		// 直接一起画
		const draw = await Promise.all([drawAlbumImg, drawBottom])
		draw()
	}
}



export default shareAlbum