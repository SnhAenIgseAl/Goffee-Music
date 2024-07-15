<template>
	<el-popover placement="right" :width="300" trigger="hover">
		<template #reference>
			<el-button link style="margin-right: 16px"><i>&#xe872;</i>更多</el-button>
		</template>
		<ul class="ctx-menu_box" ref="CtxMenuBox">

			<li class="ctx-menu_item" @click="playmusic(songId, songType)"><i>&#xe8ab;</i>播放</li>
			<li class="btm-line"></li>

			<li class="ctx-menu_item" @click="addSongToPlaylist(songId, songType)"><i>&#xe8ab;</i>添加到播放列表</li>
			<li v-if="albumList" class="btm-line"></li>
			
			<li v-if="albumList" class="ctx-menu_item"><i>&#xe90e;</i>收藏至歌单</li>
			<el-scrollbar height="135px">
				<li v-if="albumList" v-for="(item, index) in albumList" :key="index" class="ctx-menu_item album-item"
					@click="like(item.albumId)">
					{{ item.albumName }}
				</li>
			</el-scrollbar>
			
		</ul>

	</el-popover>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import serverCfg from '@/utils/serverCfg'
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const props = defineProps({
	albumList: Object,
	songId: String,
	songName: String,
	songAuthor: String,
	songImg: String,
	songType: String
})
const store = useStore()



// 播放音乐
const playmusic = async (songId, songType) => {
	// console.log(songId, songType)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/playmusic?songId=${songId}&songType=${songType}`)
		res = await res.json()
		let songInfo = res.songInfo

		// 噼哩噼哩的第三方接口中文乱码了，直接用搜索页面的数据
		if (props.songType === '4') {
			songInfo.songName = props.songName
			songInfo.songAuthor = props.songAuthor
		}

		// vuex 存储当前播放音乐信息
		store.dispatch('asyncUpdateSongInfo', songInfo)

		// vuex 添加到播放列表
		store.dispatch('asyncUpdatePlaylist', songInfo)

	} catch (err) {
		console.log('Fetch error:', err);
	}
}



// 添加到播放列表
const addSongToPlaylist = async (songId, songType) => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/playmusic?songId=${songId}&songType=${songType}`)
		res = await res.json()
		let songInfo = res.songInfo

		// 噼哩噼哩的第三方接口中文乱码了，直接用搜索页面的数据
		if (songType === '4') {
			songInfo.songName = props.songName
			songInfo.songAuthor = props.songAuthor
		}

		// vuex 添加到播放列表
		store.dispatch('asyncUpdatePlaylist', songInfo)
		// console.log(store.state.playlist)
		ElMessage({ message: '已成功添加至播放列表', type: 'success', offset: 110 })
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning', offset: 110 })
	}
}



// 收藏歌曲
const like = async (albumId) => {
	// console.log(props.songId, albumId)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/like`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({
				songId: props.songId,
				songName: props.songName,
				songImg: props.songImg,
				songType: props.songType,
				albumId: albumId
			})
		})
		res = await res.json()
		if (res.code === 200) {
			ElMessage({ message: res.msg, type: 'success', offset: 110 })
		} else {
			ElMessage({ message: res.msg, type: 'error', offset: 110 })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning', offset: 110 })
	}
}

</script>

<style scoped>
.ctx-menu_box {
	list-style: none;
	/* position: absolute; */
	width: 300px;
	height: auto;
	margin-left: -12px;
	padding: 8px;
	left: 180px;
	bottom: 108px;
	background: var(--cl-black-50);
	backdrop-filter: blur(30px);
	border-radius: 5px;
	transition: unset;

	.btm-line {
		margin: 0.8rem 0;
		border-bottom: 2px solid var(--cl-white-10);
	}

	.ctx-menu_item {
		width: 100%;
		height: 4.5rem;
		line-height: 4.5rem;
		padding: 0 8px;
		color: var(--subsubtitleColor);
		font-size: var(--subsubtitleSize);
		border-radius: 5px;

		&:hover {
			background: var(--cl-white-10);
			cursor: pointer;
		}
	}

	.album-item {
		padding: 0 36px;
	}
}
</style>