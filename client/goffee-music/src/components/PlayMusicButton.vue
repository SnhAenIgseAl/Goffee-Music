<template>
	<el-button link @click="playmusic(props.songId, props.songType)"><i>&#xe8ab;</i>播放</el-button>
</template>

<script setup>
import { useStore } from 'vuex'
import serverCfg from '@/utils/serverCfg'
import { ElMessage } from 'element-plus'

const props = defineProps({
	songId: String,		// 音乐id
	songName: String,	// 音乐名称
	songAuthor: String,	// 音乐歌手
	songType: String	// 音乐来源类型
})
const store = useStore()

// 播放音乐
const playmusic = async (songId, songType) => {
	console.log(props)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/playmusic?songId=${songId}&songType=${songType}`)
		res = await res.json()
		let songInfo = res.songInfo
		// console.log(songInfo)

		// 噼哩噼哩的第三方接口中文乱码了，直接用搜索页面的数据
		if (props.songType === '4') {
			songInfo.songName = props.songName
			songInfo.songAuthor = props.songAuthor
		}

		// vuex 存储当前播放音乐信息
		store.dispatch('asyncUpdateSongInfo', songInfo)
		// console.log(store)

		// vuex 添加到播放列表
		store.dispatch('asyncUpdatePlaylist', songInfo)
		// console.log(store.state.playlist)

	} catch (err) {
		console.log('Fetch error:', err);
	}
}


</script>

<style>

</style>