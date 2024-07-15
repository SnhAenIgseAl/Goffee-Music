const musicVisual = {
	install() {
		const myAudio = document.querySelector('#audio')
		let source
		// let audioCtx
		// let gainNode
		myAudio.addEventListener('play', visual)

		function visual() {

			const canvas = document.getElementById("music-visual")
			const canvasCtx = canvas.getContext("2d")

			// audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
			// source = source || audioCtx.createMediaElementSource(myAudio)
			let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
			try {
				source = audioCtx.createMediaElementSource(myAudio)
			} catch (err) {}
			
			let gainNode = audioCtx.createGain();
			gainNode.gain.value = 0.65

			let analyser = audioCtx.createAnalyser()
			analyser.fftSize = 1024

			let bufferLength = analyser.frequencyBinCount
			let dataArray = new Uint8Array(bufferLength)
			// console.log(dataArray)

			source.connect(analyser).connect(gainNode)
			analyser.connect(audioCtx.destination)

			let width = canvas.width
			let height = canvas.height

			// 绘制音频
			function draw() {
				canvasCtx.clearRect(0, 0, width, height);
				let drawVisual = requestAnimationFrame(draw);

				analyser.getByteFrequencyData(dataArray);

				let barWidth = (width / bufferLength) * 3;
				let barHeight;

				/*
				 * 低音部分
				 */
				let stride = 2		// 步幅
				let x = 5			// 绘制的起始位置
				for (let i = 0; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 800

					// 线条
					drawRect(x, -10, barWidth - 15, barHeight - 3, '#fff')

					if (x >= width / 2 - 30) {
						break
					}

					x = x + 30;
				}
				x = width + 5
				for (let i = 0; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 800

					// 线条
					drawRect(x, -10, barWidth - 15, barHeight - 3, '#fff')

					if (x <= width / 2 + 30) {
						break
					}

					x = x - 30;
				}

				/*
				 * 高音部分
				 */
				stride = 1
				x = 20
				for (let i = 128; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 700

					// 线条
					drawRect(x, -10, barWidth - 15, barHeight - 3, '#fff')

					if (x >= width / 2 - 30) {
						break
					}

					x = x + 30;
				}
				x = width - 10
				for (let i = 128; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 700

					// 线条
					drawRect(x, -10, barWidth - 15, barHeight - 3, '#fff')

					if (x <= width / 2 + 30) {
						break
					}

					x = x - 30;
				}
			}



			/**
			 * 封装的绘制矩形函数，带阴影效果
			 * @param {*} x1 横坐标1
			 * @param {*} y1 纵坐标1
			 * @param {*} x2 横坐标2
			 * @param {*} y2 纵坐标2
			 * @param {*} color 矩形及阴影颜色
			 */
			function drawRect(x1, y1, x2, y2, color) {
				canvasCtx.shadowOffsetX = 0;
				canvasCtx.shadowOffsetY = 0;
				canvasCtx.shadowColor = color;
				canvasCtx.shadowBlur = 20;
				canvasCtx.fillStyle = color
				canvasCtx.fillRect(x1, y1, x2, y2);
				canvasCtx.shadowBlur = 10;
				canvasCtx.fillRect(x1, y1, x2, y2);
				canvasCtx.shadowBlur = 5;
				canvasCtx.fillRect(x1, y1, x2, y2);
			}
			draw()
		}
	},
	// uninstall() {
	// 	const myAudio = document.querySelector('#audio')
	// 	console.log('解除绑定')
	// 	myAudio.removeEventListener('play', this.visual, false)
	// 	console.log(getEventListeners(myAudio))
	// },
	visual() {

	},

}



export default musicVisual