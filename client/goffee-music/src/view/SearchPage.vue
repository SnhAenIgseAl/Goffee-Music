<template>
	<div class="wallpaper">

		<!-- 网易云 -->
		<div class="container song-list" v-if="songType === '1'" v-for="(item, index) in songList" :key="index"
			:style="{ backgroundImage: `url(${item.imgUrl}` }">
			<div class="con-title">
				<PlayMusicButton :songId="item.id + ''" :songType="'1'" />
				<SearchCtxMenu 
					:albumList="albumList" 
					:songId="item.id + ''"
					:songName="item.name"
					:songImg="item.imgUrl"
					:songType="'1'"
				/>
				<p class="subtitle ellipsis">{{ item.name }}</p>
				<p class="subsubtitle ellipsis">{{ item.artists[0].name }} · {{ item.album.name }}</p>
			</div>
		</div>

		<!-- 酷狗 -->
		<div class="container song-list" v-if="songType === '2'" v-for="(item, index) in songList" :key="index"
			:style="{ backgroundImage: `url(${item.Image}` }">
			<div class="con-title">
				<PlayMusicButton :songId="item.FileHash" :songType="'2'" />
				<SearchCtxMenu 
					:albumList="albumList" 
					:songId="item.FileHash"
					:songName="item.SongName"
					:songImg="item.Image"
					:songType="'2'"
				/>
				<p class="subtitle ellipsis">{{ item.SongName }}</p>
				<p class="subsubtitle ellipsis">{{ item.SingerName }} · {{ item.AlbumName }}</p>
			</div>
		</div>

		<!-- 酷我 -->
		<div class="container song-list" v-if="songType === '3'" v-for="(item, index) in songList" :key="index"
			:style="{ backgroundImage: `url(${item.web_albumpic_short}` }">
			<div class="con-title">
				<PlayMusicButton :songId="item.MUSICRID" :songType="'3'" />
				<SearchCtxMenu 
					:albumList="albumList" 
					:songId="item.MUSICRID"
					:songName="item.SONGNAME"
					:songImg="item.web_albumpic_short"
					:songType="'3'"
				/>
				<p class="subtitle ellipsis">{{ item.SONGNAME }}</p>
				<p class="subsubtitle ellipsis">{{ item.ARTIST }} · {{ item.ALBUM }}</p>
			</div>
		</div>

		<!-- 噼哩噼哩 -->
		<div class="container song-list" v-if="songType === '4'" v-for="(item, index) in songList" :key="index"
			:style="{ backgroundImage: `url(https://images.weserv.nl/?url=http:${item.pic}` }">
			<div class="con-title">
				<PlayMusicButton 
					:songId="item.bvid" 
					:songName="item.title"
					:songAuthor="item.author"
					:songType="'4'" />
				<SearchCtxMenu 
					:albumList="albumList" 
					:songId="item.bvid"
					:songName="item.title"
					:songAuthor="item.author"
					:songImg="'https://images.weserv.nl/?url=http:' + item.pic"
					:songType="'4'"
				/>
				<p class="subtitle ellipsis">{{ item.title }}</p>
				<p class="subsubtitle ellipsis">{{ item.author }}</p>
			</div>
		</div>
	</div>

	
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import PlayMusicButton from '@/components/PlayMusicButton.vue'
import serverCfg from '@/utils/serverCfg'
import SearchCtxMenu from '@/components/SearchCtxMenu.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
var keyword = ref('')
var songType = ref('')
var songList = ref(null)

watch(() =>
	[route.query.keyword, route.query.songType],
	async (newValue, oldValue) => {
		// console.log(newValue)
		keyword.value = newValue[0]
		songType.value = newValue[1]
		try {
			let res = await fetch(`${serverCfg.host}${serverCfg.port}/serch?keyword=${keyword.value}&songType=${songType.value}`)
			res = await res.json()
			songList.value = res.songList
			// console.log(songList.value)
		} catch (err) {
			ElMessage({ message: '网络未连接', type: 'warning' })
		}
	}, { immediate: true })

const albumList = ref(null)
const getAlbumList = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/home`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.code === 200) {
			albumList.value = await res.data.albumList
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期' + err, type: 'warning' })
	}
}
getAlbumList()

</script>

<style>
.ellipsis {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>

