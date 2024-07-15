<template>
	<div class="wallpaper">
		<div class="logo"></div>

		<!-- 网站介绍 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				什么是<br>
				Goffee Music？
			</p>
			<!-- <p class="subsubtitle">鼠标滚轮下滑查看更多</p> -->
		</div>
		<div class="container extend sign">
			<div class="con-title">
				<p class="subsubtitle">
					你说得对，但是 Goffee Music 是由 SnhAenIgseAl 开发的在线音乐播放平台，旨在让用户无需切换客户端听到自己喜欢的歌。<br>
					Goffee Music 致力于打造纯粹的听歌网站。在这里，你将扮演一位名为「用户」的神秘角色，在主流音乐网站搜索自己喜欢的歌或是与伙伴们一起分享歌单，找到隐藏的网站彩蛋 ——
					同时，逐步发掘网站皇帝「权限」的真相。
				</p>
			</div>
		</div>

		<!-- 今日热门 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				今日热门歌曲
			</p>
		</div>
		<div class="container song-list" v-for="(item, index) in hotMusic" :key="index"
			:style="'background-image: url(' + item.picUrl + ');'">
			<div class="con-title">
				<PlayMusicButton :songId="item.id" :songType="'1'" />
				<p class="subtitle">{{ item.song.name }}</p>
				<p class="subsubtitle">{{ item.song.artists[0].name }} · {{ item.song.album.name }}</p>
			</div>
		</div>

		<!-- 叠盾 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>03<br><br>
				API 开源支持<br>
				仅做学习交流
			</p>
			<p class="subsubtitle">
				<a href="https://github.com/Binaryify/NeteaseCloudMusicApi"
					target="_blank"><i>&#xe960;</i>NeteaseCloudMusicApi</a><br>
				<a href="https://github.com/SocialSisterYi/bilibili-API-collect"
					target="_blank"><i>&#xe960;</i>bilibili-API-collect</a>
			</p>
		</div>

		<!-- 网站版权信息 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>04<br><br>
				Copyright © 2024 <br>
				SnhAenIgseAl
			</p>
			<p class="subsubtitle">
				<a href="https://space.bilibili.com/109066415" target="_blank"><i>&#xe75c;</i>Bilibili ·
					SnhAenIgseAl</a><br>
				<a href="https://github.com/SnhAenIgseAl" target="_blank"><i>&#xe960;</i>Github · SnhAenIgseAl</a>
			</p>
		</div>
		<div class="container extend all">
			<img src="https://images.weserv.nl/?url=https://i.ibb.co/DLHrxfM/thatsAll.png">
		</div>

		<!-- <div class="fliter"></div> -->
	</div>
</template>

<script setup>
import { ref } from 'vue'
import PlayMusicButton from '@/components/PlayMusicButton.vue'


var hotMusic = ref(null)
const getHotMusic = async () => {
	try {
		let res = await fetch('http://localhost:3000/personalized/newsong?limit=10')
		res = await res.json()
		res = res.result
		for (let i = 0; i < res.length; i++) {
			res[i].id = res[i].id + ''
		}
		hotMusic.value = res
		// console.log(hotMusic.value)
	} catch (err) {
		console.log('网络未连接');
	}
}
getHotMusic()

</script>

<style>
.all {
	width: 780px;
	animation: coruscate 3s infinite;
}

@keyframes coruscate {
	0% {
		filter: none;
	}

	50% {
		filter:
			drop-shadow(0 0 10px var(--cl-white-50)) drop-shadow(0 0 50px var(--cl-white-25));
	}

	100% {
		filter: none;
	}
}

.logo {
	width: 960px;
	min-width: 960px;
	height: 100%;
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/myH4YJ1/Goffee-Music-No-Reflect.png');
}

.sign {
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/vsbXy9p/sign.jpg');
}</style>