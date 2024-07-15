const musicControl = {
	install() {
		const audio = document.getElementById('audio')
		const progressBox = document.getElementById('progress-box')
		const progress = document.getElementById('progress')




		// 默认音量
		audio.volume = '0.65'
		// audio.volume = '0'
		


		// 更新进度条
		audio.addEventListener('timeupdate', updateProgress)
		function updateProgress() {
			var value = audio.currentTime / audio.duration
			progress.style.width = value * 100 + '%'
		}



		// 点击进度条跳到指定点播放
		progressBox.onmousedown = function (event) {
			if (!audio.paused || audio.currentTime != 0) {
				var pgsWidth = parseFloat(window.getComputedStyle(progressBox, null).width.replace('px', ''));
				var rate = event.offsetX / pgsWidth;
				audio.currentTime = audio.duration * rate;
				updateProgress(audio);
			}
		}



		// 倒影开关
		// const reflect = document.getElementById('reflect')
		// const wallper = document.getElementsByClassName('wallper')[0]
		// let style = getComputedStyle(wallper, '::before');
		// const showReflect = true
		// reflect.onmousedown = () => {
		// 	showReflect = !showReflect
		// 	if (showReflect) {
		// 		reflect.style.setProperty('')
		// 	} else {

		// 	}
		// }



		// 从头开始播放
		const back = document.getElementById('back')
		back.onmousedown = () => {
			audio.currentTime = 0
			updateProgress(audio);
		}



		// 播放 暂停
		const play = document.getElementById('play')
		play.onmousedown = () => {
			if (audio.paused) {
				audio.play();
				play.innerHTML = '<i>&#xe890;</i>'
			} else {
				audio.pause();
				play.innerHTML = '<i>&#xe74f;</i>'
			}
		}



		// 音量控制
		const volume = document.getElementById('volume')
		const volumePoint = document.getElementById('volume-point')
		const volumeValue = document.getElementById('volume-value')
		volumePoint.style.width = parseInt(audio.volume * 100) + '%'
		volume.onmousedown = function(event) {
			var rate = event.offsetX / 100;
			audio.volume = rate;
			volumeValue.innerHTML = parseInt(rate * 100) + ''
			volumePoint.style.width = parseInt(rate * 100) + '%'
		}
	}
}



export default musicControl