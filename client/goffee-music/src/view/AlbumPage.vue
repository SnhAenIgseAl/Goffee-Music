<template>
	<div class="wallpaper" v-if="albumInfo">

		<!-- 歌单信息及封面 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				{{ albumInfo.createdBy }}<br>
				创建的歌单
			</p>
			<p class="subsubtitle">{{ albumInfo.albumDscrp }}</p>
		</div>
		<div class="container extend"
			:style="{ backgroundImage: `url(https://images.weserv.nl/?url=${albumInfo.albumImg})` }"></div>

		<!-- 歌单封面 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				歌曲列表
			</p>
		</div>
		<div class="container song-list" v-for="(item, index) in albumSongs" :key="index"
			:style="{ backgroundImage: `url(${item.songImg})` }">
			<div class="con-title">
				<PlayMusicButton :songId="item.songId" :songName="item.songName" :songType="item.songType" />
				<p class="subtitle ellipsis">{{ item.songName }}</p>
			</div>
		</div>
	</div>

	<CantAccessPage v-else />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import serverCfg from '@/utils/serverCfg'
import PlayMusicButton from '@/components/PlayMusicButton.vue'
import CantAccessPage from './CantAccessPage.vue'

const route = useRoute()

// 获取歌单信息
const albumInfo = ref(null)
const albumSongs = ref(null)

watch(() => route.params.albumId, async (newValue, oldValue) => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/album?albumId=${newValue}`)
		res = await res.json()
		if (res.success) {
			albumInfo.value = res.data.albumInfo[0]
			albumSongs.value = res.data.albumSongs

			for (let i = 0; i < albumSongs.value.length ; i++) {
				if (albumSongs.value[i].songType === '4') {
					albumSongs.value[i].songImg = 'https://images.weserv.nl/?url=http:' + albumSongs.value[i].songImg
				}
			}
		} else {
			albumInfo.value = null
		}
	} catch (err) {
		ElMessage({ message: '连接服务器失败' + err, type: 'error' })
	}
}, { immediate: true })


</script>

<style></style>