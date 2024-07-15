import Vue from 'vue'
import Vuex from 'vuex'



const state = {
	userInfo: {		// 当前用户信息

	},
	songInfo: {		// 当前播放音乐信息
		songId: '',
		songName: '',
		songAuthor: '',
		songImg: '',
		songUrl: '',
		songType: ''
	},
	playlist: []	// 播放列表
}

const getters = {
	getUserInfo(state) {
		return state.userInfo
	},
	getSongInfo(state) {
		return state.songInfo
	},
	getPlaylist(state) {
		return state.playlist
	}
}

const mutations = {

	// 更新用户信息
	updateUserInfo(state, userInfo) {
		state.userInfo = userInfo
	},

	// 更新当前播放音乐信息
	updateSongInfo(state, songInfo) {
		state.songInfo = songInfo
	},

	// 更新播放列表
	updatePlaylist(state, songInfo) {
		// 去重
		for (let i = 0; i < state.playlist.length; i++) {
			if (state.playlist[i].songId === songInfo.songId) {
				return false
			}
		}
		state.playlist.push(songInfo)
		return true
	},

	// 从播放列表删除歌曲
	delSongFromPlaylist(state, index) {
		state.playlist.splice(index, 1)
	}
}

const actions = {
	asyncUpdateUserInfo(context, userInfo) {
		context.commit('updateUserInfo', userInfo)
	},
	asyncUpdateSongInfo(context, songInfo) {
		context.commit('updateSongInfo', songInfo)
	},
	asyncUpdatePlaylist(context, songInfo) {
		context.commit('updatePlaylist', songInfo)
	},
	asyncDelSongFromPlaylist(context, index) {
	    context.commit('delSongFromPlaylist', index)
	}
}



export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions
})
