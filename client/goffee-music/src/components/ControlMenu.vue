<template>
	<!-- 歌曲播放控制 -->
	<div class="music-control">
		<div class="current-play">
			<div class="current-play_txt">
				{{ $store.state.songInfo.songName }} - {{ $store.state.songInfo.songAuthor }}
			</div>
		</div>
		<!-- 播放列表-->
		<el-button link @click="showPlaylist = !showPlaylist"><i>&#xe660;</i></el-button>
		<!-- 从头开始 -->
		<el-button link id="back"><i>&#xe999;</i></el-button>
		<!-- 上一首 -->
		<el-button link @click="preSong"><i>&#xe9a3;</i></el-button>
		<!-- 播放 暂停 -->
		<el-button link id="play"><i>&#xe890;</i></el-button>
		<!-- 下一首 -->
		<el-button link @click="nextSong"><i>&#xe9a4;</i></el-button>
		<!-- 音量控制 -->
		<el-button link><i>&#xe8fc;</i></el-button>
		<div id="volume">
			<div id="volume-point"></div>
		</div>
		<div id="volume-value">65</div>
	</div>

	<!-- 播放列表 -->
	<el-drawer v-model="showPlaylist" title="播放列表" :size="800" :append-to-body="true" :style="{ padding: `20px` }">
		<p v-if="playlist" v-for="(item, index) in playlist" :key="index" class="playlist">
			<span class="playlist-txt">{{ item.songName }} - {{ item.songAuthor }}</span>
			<span>
				<PlayMusicButton :songId="item.songId" :songName="item.songName" :songAuthor="item.songAuthor" :songType="item.songType" />
				<PlaylistDelSongBtn :index="index" />
			</span>
		</p>
	</el-drawer>

	<!-- 歌曲进度条 -->
	<div id="progress-box">
		<div id="progress">
			<div id="point"></div>
		</div>
	</div>

	<!-- 音频可视化 -->
	<MusicVisual />

	<audio name="media" id="audio" ref="Audio">
		<source src="" type="audio/mp3">
	</audio>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import serverCfg from '@/utils/serverCfg'
import musicControl from '@/utils/musicControl'
import PlayMusicButton from './PlayMusicButton.vue'
import PlaylistDelSongBtn from './PlaylistDelSongBtn.vue'
import { ElMessage } from 'element-plus'
import MusicVisual from './MusicVisual.vue'

const store = useStore()



// 获取播放列表
var showPlaylist = ref(false)
var currentInfo = store.state.songInfo
var playlist = store.state.playlist
// console.log(playlistData)



// 切换上一首
const preSong = () => {
	let index = getCurrentIndex(store.state.songInfo, store.state.playlist)
	if (index === 0) {		// 如果当前是第一首，则切换至播放列表最后一首
		store.dispatch('asyncUpdateSongInfo', store.state.playlist[store.state.playlist.length - 1])
	} else {
		store.dispatch('asyncUpdateSongInfo', store.state.playlist[index - 1])
	}
}



// 切换下一首
const nextSong = () => {	
	let index = getCurrentIndex(store.state.songInfo, store.state.playlist)
	if (index === store.state.playlist.length - 1) {	// 如果当前是最后一首，则切换至播放列表第一首
		store.dispatch('asyncUpdateSongInfo', store.state.playlist[0])
	} else {
		store.dispatch('asyncUpdateSongInfo', store.state.playlist[index + 1])
	}
}


var Audio = ref(null)
// console.log(Audio.value)



// 监听当前播放音乐和播放列表变化
watch(() => [
	store.state.songInfo,
	store.state.playlist
], async (newValue, oldValue) => {
	var currentInfo = newValue[0] || oldValue[0]
	var playlist = newValue[1] || oldValue[1]
	// console.log('currentInfo', currentInfo, 'playlist', playlist)

	// 设置当前播放音乐信息
	let audio = Audio.value
	audio.pause()
	audio.currentTime = 0;
	audio.src = currentInfo.songUrl
	audio.load()
	audio.onloadedmetadata = () => {
		audio.play().catch(err => {
			ElMessage({ message: '要vip，换一首吧', type: 'warning' })
		})
	}

	// 获取当前播放歌曲在播放列表的索引
	let index = ref(Number)
	index.value = getCurrentIndex(currentInfo, playlist)

	// 当前歌曲播放完毕自动切换下一首
	audio.addEventListener('ended', function () {
		// 若为播放列表的最后一首，则切换至播放列表第一首
		if (index.value === playlist.length - 1) {
			index.value = 0
			store.dispatch('asyncUpdateSongInfo', playlist[index.value])
		} else {
			store.dispatch('asyncUpdateSongInfo', playlist[index.value + 1])
		}
	})
})

const getCurrentIndex = (currentInfo, playlist) => {
	for (let i = 0; i < playlist.length; i++) {
		if (currentInfo.songId == playlist[i].songId) {
			return i
		}
	}
}

onMounted(() => {
	// 音乐播放控制
	musicControl.install()
})

</script>

<style scoped>
.playlist {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: auto;
	color: var(--subtitleColor);
	font-size: var(--subsubtitleSize);
	line-height: 4.8rem;
	text-align: left;

	.playlist-txt {
		width: 80%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}

.music-control {
	position: fixed;
	z-index: 9999;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-items: center;
	padding: 30px;
	bottom: 30px;
	width: auto;
	left: 50%;
	transform: translateX(-50%);
	height: 30px;
	color: var(--titleColor);
	background: var(--cl-black-75);
	border-radius: 12px;

	.current-play {
		position: relative;
		width: 200px;
		height: 30px;
		line-height: 30px;
		color: var(--titleColor);
		font-size: var(--subsubtitleSize);
		margin-right: 30px;
		overflow: hidden;

		.current-play_txt {
			position: absolute;
			width: 100%;
			height: 100%;
			line-height: 30px;
			left: 0px;
			/* animation: showSongInfo 3s infinite linear; */
		}

		/* @keyframes showSongInfo {
			from {
				left: 0px;
			},
			to {
				left: -500px;
			}
		} */
	}

	#volume {
		width: 100px;
		height: 10px;
		border-radius: 5px;
		background: var(--cl-white-10);
		cursor: pointer;
	}

	#volume-point {
		position: relative;
		border-radius: 5px;
		height: 10px;
		background: var(--cl-white);
	}

	#volume-value {
		/* position: absolute; */
		text-align: center;
		width: 30px;
		height: 20px;
		line-height: 20px;
		font-size: 18px;
	}
}

#progress-box {
	position: fixed;
	z-index: 9;
	top: 720px;
	width: 100%;
	height: 5px;
	background: var(--cl-white-10);

	&:hover {
		cursor: pointer;
	}
}

#progress {
	position: relative;
	width: 0%;
	height: 100%;
	background: var(--cl-white);
	box-shadow: var(--whiteShadow);
}

#point {
	position: absolute;
	top: -2.5px;
	right: -5px;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: var(--cl-white);
	box-shadow: var(--whiteShadow), var(--whiteShadow), var(--whiteShadow);
}

#audio {
	position: fixed;
	z-index: 9999;
	bottom: 0;
}

.lrc {
	position: fixed;
	z-index: 9;
	width: 100%;
	bottom: 120px;
	text-align: center;
	font-size: var(--subtitleSize);
	color: var(--subtitleColor);
	line-height: 3rem;
	text-shadow: 0px 0px 5px #000;
}

.el-drawer__body {
	padding: var(--el-drawer-padding-primary);
}

</style>