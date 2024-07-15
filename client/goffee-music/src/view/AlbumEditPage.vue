<template>
	<div class="wallpaper">

		<!-- 基本信息 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				更改歌单<br />
				基本信息
			</p>
		</div>
		<div class="container text-info">
			<el-form ref="formRef" :model="editFrom" :rules="rules">
				<el-form-item label="编号">
					<p class="subsubtitle" style="margin-left: 0.9rem;">{{ editFrom.albumId }}</p>
				</el-form-item>
				<el-form-item prop="albumName" label="昵称">
					<el-input v-model="editFrom.albumName" clearable placeholder="歌单名称"></el-input>
				</el-form-item>
				<el-form-item label="简介">
					<el-input v-model="editFrom.albumDscrp" type="textarea" clearable placeholder="歌单简介" resize="none"
						:rows="11"></el-input>
				</el-form-item>
				<el-form-item label="隐私">
					<el-switch v-model="editFrom.canSee" size="large" active-text="歌单所有人可见" inactive-text="歌单仅自己可见" />
				</el-form-item>
			</el-form>
		</div>

		<!-- 更改歌单封面 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				更改歌单封面
			</p>
		</div>
		<div class="container text-info upload">
			<el-upload 
				ref="imgFile" 
				class="avatar-uploader" 
				:auto-upload="false" 
				:show-file-list="false"
				:on-change="previewImg">
				<img v-if="imageUrl" :src="imageUrl" class="avatar" />
				<el-icon v-else class="avatar-uploader-icon">
					<Plus />
				</el-icon>
			</el-upload>
		</div>

		<!-- 管理歌曲 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>03<br><br>
				管理歌单歌曲
			</p>
		</div>
		<div class="container song-list" v-for="(item, index) in albumSongs" :key="index"
			:style="{ backgroundImage: `url(${item.songImg})` }">
			<div class="con-title">
				<el-button link @click="dialogVisible = true; delSongId = item.songId"><i>&#xe8ab;</i>删除</el-button>
				<p class="subtitle ellipsis">{{ item.songName }}</p>
			</div>
		</div>
		<el-dialog v-model="dialogVisible" title="提示" width="500" :show-close="false">
			<span>确定删除此歌曲吗</span>
			<template #footer>
				<div class="dialog-footer">
					<el-button link @click="dialogVisible = false">取消</el-button>
					<el-button link @click="delSong(delSongId)">确定</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 确认 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>04<br><br>
				确定好了吗
			</p>
		</div>
		<div v-loading="loading" class="container song-list confirm" @click="checkForm(formRef, updateAlbum)">
			<div class="con-title">
				<p class="subtitle">
					<i>&#xe886;</i>确定
				</p>
			</div>
		</div>
		<div class="container song-list reset" @click="getUserInfo">
			<div class="con-title">
				<p class="subtitle">
					<i>&#xe79b;</i>重新开始
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import serverCfg from '@/utils/serverCfg'
import uploadCfg from '@/utils/uploadCfg'
import checkForm from '@/utils/checkForm'
import { useRoute } from 'vue-router'

const route = useRoute()

// const albumId = route.params.albumId
const formRef = ref(null)
const editFrom = reactive({
	albumId: route.params.albumId,
	albumName: null,
	albumDscrp: null,
	canSee: null,
	albumImg: null
})
const albumSongs = ref(null)


const getAlbumInfo = async () => {
	window.scrollTo(0, 0)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/self/album?albumId=${editFrom.albumId}`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		albumSongs.value = res.data.albumSongs
		res = res.data.albumInfo[0]
		editFrom.albumName = res.albumName
		editFrom.albumDscrp = res.albumDscrp
		editFrom.canSee = res.canSee === 1 ? true : false
		editFrom.albumImg = res.albumImg
	} catch (err) {
		ElMessage({ message: '用户登录状态已过期'+ err, type: 'warning' })
	}
}
getAlbumInfo()

const rules = reactive({
	albumName: [
		{ required: true, message: '歌单名称不能为空', trigger: 'blur' }
	]
})



// 预览图片
const imageUrl = ref(null)
const files = ref([])
const previewImg = (uploadFile) => {

	// 检查上传图片的格式以及大小
	if (uploadFile.raw.type !== 'image/jpg' &&
		uploadFile.raw.type !== 'image/jpeg' &&
		uploadFile.raw.type !== 'image/png'
	) {
		ElMessage({ message: '必须是jpg或png格式的图片', type: 'error' })
		return false
	} else if (uploadFile.raw.size / 1024 / 1024 > 5) {
		ElMessage({ message: '图片需小于5MB', type: 'error' })
		return false
	}

	// 没问题就图片预览，不上传
	imageUrl.value = URL.createObjectURL(uploadFile.raw)
	console.log(uploadFile.raw)
	files.value.push(uploadFile.raw)
}



// 从歌单删除歌曲
var dialogVisible = ref(false)
var delSongId = ref(null)
const delSong = async (songId) => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/dislike`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({
				songId: songId,
				albumId: editFrom.albumId
			})
		})
		res = await res.json()
		if (res.success) {
			ElMessage({message: res.msg, type: 'success'})
			for (let i = 0; i < albumSongs.value.length; i++) {
				if (albumSongs.value[i].songId === songId) {
					albumSongs.value.splice(i, 1)
				}
			}
		} else {
			ElMessage({message: res.msg, type: 'error'})
		}
	} catch (err) {
		ElMessage({message: '登录状态已过期' + err, type: 'warning'})
	}
	dialogVisible.value = false
}



// 歌单更新信息提交
const imgFile = ref(null)
const loading = ref(false)
const updateAlbum = async () => {

	loading.value = true

	// 将图片上传至图床
	var formData = new FormData()
	imgFile.value = files.value[files.value.length - 1]

	if (imgFile.value) {
		formData.append('image', imgFile.value)
		formData.append('key', uploadCfg.key)

		editFrom.albumImg = await new Promise((resolve, reject) => {
			fetch(`${uploadCfg.api}`, {
				method: 'POST',
				body: formData,
			})
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					ElMessage({ message: '图片上传成功', type: 'success' })
					resolve(res.data.url)
				} else {
					ElMessage({ message: '图片上传失败', type: 'error' })
				}
			})
			.catch(err => {
				ElMessage({ message: '网络未连接', type: 'error' })
			})
		})
		console.log(editFrom.albumImg)
	}



	// 更新歌单信息
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/updateAlbum`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({ editFrom })
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
			window.location.href = '/#/home'
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
}


</script>

<style>

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
</style>