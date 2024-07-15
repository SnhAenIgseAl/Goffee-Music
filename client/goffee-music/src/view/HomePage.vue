<template>

	<div class="wallpaper" v-if="userInfo">

		<div class="logo"></div>

		<!-- 用户头像 -->
		<div id="欢迎回来" class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				欢迎回来<br />
				{{ userInfo.username }}
			</p>
		</div>
		<div class="container extend" :style="{ backgroundImage: `url(https://images.weserv.nl/?url=${userInfo.userImg})` }">
			<div class="con-title">
				<p class="subsubtitle">
					{{ userInfo.userDscrp }}
				</p>
			</div>
		</div>

		<!-- 创建的歌单 -->
		<div id="歌单列表" class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				歌单列表
			</p>
		</div>
		<div class="container song-list" v-for="(item, index) in albumList" :key="index"
			:style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.albumImg})` }">

			<div class="con-title">
				<RouterLink :to="{ name: 'selfAlbum', params: { albumId: item.albumId } }"><i>&#xe7a4;</i>查看</RouterLink>
				<AlbumCtxMenu :albumId="item.albumId" :albumList="albumList"/>
				<el-text v-if="item.status === 0" class="album-status" type="warning">审核中</el-text>
				<el-text v-if="item.status === -1" class="album-status" type="error">审核未通过</el-text>
				<p class="subtitle">{{ item.albumName }}</p>
				<p class="subsubtitle">{{ item.albumDscrp }}</p>
			</div>
		</div>

		<div class="container song-list add-album" @click="toAddAlbum">
			<div class="con-title">
				<p class="subtitle">
					<i>&#xe7a3;</i>新建歌单
				</p>
			</div>
		</div>

		<!-- 播放本地音乐 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>03<br><br>
				播放本地音乐
			</p>
			<p class="subsubtitle">
				暂停再播放会弹出一个警告，不用理会
			</p>
		</div>
		<div class="container text-info upload">
			<el-upload 
				ref="musicFile" 
				class="avatar-uploader" 
				:auto-upload="false" 
				:show-file-list="false"
				:on-change="playLocalMusic">
				<img v-if="imageUrl" :src="imageUrl" class="avatar" />
				<el-icon v-else class="avatar-uploader-icon">
					<Plus />
				</el-icon>
			</el-upload>
		</div>

		<!-- 其他操作 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>04<br><br>
				其他操作
			</p>
		</div>
		<RouterLink to="edit">
			<div class="container song-list edit-user">
				<div class="con-title">
					<p class="subtitle">
						<i>&#xe83e;</i>编辑信息
					</p>
				</div>
			</div>
		</RouterLink>
		<RouterLink to="setPassword">
			<div class="container song-list set-password">
				<div class="con-title">
					<p class="subtitle">
						<i>&#xe83e;</i>修改密码
					</p>
				</div>
			</div>
		</RouterLink>
		<RouterLink to="setEmail">
			<div class="container song-list set-email">
				<div class="con-title">
					<p class="subtitle">
						<i>&#xe995;</i>更改邮箱
					</p>
				</div>
			</div>
		</RouterLink>
		<RouterLink to="remake">
			<div class="container song-list remake">
				<div class="con-title">
					<p class="subtitle">
						<i>&#xe7a3;</i>注销账号
					</p>
				</div>
			</div>
		</RouterLink>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import serverCfg from '@/utils/serverCfg'
import { ElMessage } from 'element-plus'
import AlbumCtxMenu from '@/components/AlbumCtxMenu.vue'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

// 获取用户主页信息
const userInfo = ref(null)
const albumList = ref(null)
const getHomeInfo = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/home`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.code === 200) {
			userInfo.value = await res.data.userInfo
			albumList.value = await res.data.albumList
		} else {
			window.location.href = '/#/login'
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期' + err, type: 'error' })
	}
}
getHomeInfo()



// 跳转至创建歌单页面
function toAddAlbum() {
	window.location.href = '/#/addAlbum'
}



// 播放本地音乐
const store = useStore()
const imageUrl = ref(null)
const playLocalMusic = (file) => {
	console.log(file.raw)

	// 检查上传音乐的格式
	if (file.raw.type !== 'audio/mpeg' &&
		file.raw.type !== 'audio/x-m4a' &&
		file.raw.type !== 'audio/flac'
	) {
		ElMessage({ message: '必须是音乐格式的文件', type: 'error' })
		return false
	}

	// 没问题就更新vuex
	let songInfo = {
		songName: file.raw.name,
		songUrl: URL.createObjectURL(file.raw),
		songType: '5'
	}
	store.dispatch('asyncUpdateSongInfo', songInfo)
}

</script>

<style scoped>

.album-status {
	font-size: var(--subsubtitleSize);
}

.add-album {
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/wQ2g1CV/addAlbum.jpg');
}

.upload {
	border: 2px dashed var(--cl-white-25);
	border-radius: 10px;
	overflow: hidden;

	&:hover {
		border-color: var(--el-color-primary);
	}
}

.avatar-uploader .el-upload {
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 390px;
	height: 535px;
	text-align: center;
}

.avatar {
	height: 535px;
}

.edit-user {
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/TMMsrdz/editUser.jpg');
}

.set-password {
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/6y2vb3T/set-Password.jpg');
}

.set-email {
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/2sW1X2J/setEmail.jpg');
}

.remake {
	background-image: url('https://images.weserv.nl/?url=https://i.ibb.co/9gb7QtF/setting.jpg');
}
</style>
