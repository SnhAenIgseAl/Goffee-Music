<template>
	<div class="wallpaper" v-if="userInfo">
		<div class="logo"></div>

		<!-- 用户头像 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				{{ userInfo.username }}的主页
			</p>
		</div>
		<div class="container extend" :style="{ backgroundImage: `url(${userInfo.userImg})` }">
			<div class="con-title">
				<p class="subsubtitle">
					{{ userInfo.userDscrp }}
				</p>
			</div>
		</div>

		<!-- 创建的歌单 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				{{ userInfo.username }}的歌单
			</p>
		</div>
		<div class="container song-list" v-for="(item, index) in albumList" :key="index"
			:style="{ backgroundImage: `url(${item.albumImg})` }">
			<div class="con-title">
				<RouterLink :to="{ name: 'album', params: { albumId: item.albumId } }"><i>&#xe7a4;</i>查看</RouterLink>
				<p class="subtitle">{{ item.albumName }}</p>
				<p class="subsubtitle">{{ item.albumDscrp }}</p>
			</div>
		</div>
	</div>

	<CantAccessPage v-else/>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import serverCfg from '@/utils/serverCfg';
import { useRoute } from 'vue-router';
import CantAccessPage from './CantAccessPage.vue';

const route = useRoute()

const userInfo = ref(null)
const albumList = ref(null)

watch(() => route.params.username, async (newValue, oldValue) => {
	console.log(newValue)
	// 获取用户主页信息
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/profile?username=${newValue}`)
		res = await res.json()
		if (res.success) {
			userInfo.value = await res.data.userInfo
			albumList.value = await res.data.albumList
		} else {
			userInfo.value = null
		}
	} catch (err) {
		ElMessage({ message: '连接服务器失败', type: 'error' })
	}
}, { immediate: true })

</script>

<style>
</style>