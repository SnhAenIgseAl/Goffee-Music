<template>
	<div class="wallpaper">

		<!-- 基本信息 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				更改基本信息
			</p>
		</div>
		<div class="container text-info">
			<el-form ref="formRef" :model="editFrom" :rules="rules">
				<el-form-item label="UID">
					<p class="subsubtitle" style="margin-left: 1.2rem;">{{ userId }}</p>
				</el-form-item>
				<el-form-item prop="username" label="昵称">
					<el-input v-model="editFrom.username" clearable placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item label="简介">
					<el-input v-model="editFrom.userDscrp" type="textarea" clearable placeholder="用户描述" resize="none"
						:rows="11"></el-input>
				</el-form-item>
				<el-form-item label="隐私">
					<el-switch v-model="editFrom.canSee" size="large" active-text="主页所有人可见" inactive-text="主页仅自己可见" />
				</el-form-item>
			</el-form>
		</div>

		<!-- 更改头像 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				更改头像
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

		<!-- 确认 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>03<br><br>
				确定好了吗
			</p>
		</div>
		<!-- 太诡异了，回调调不到 -->
		<!-- <div class="container song-list confirm" @click="checkForm(formRef, updateUser)"> -->
		<div v-loading="loading" class="container song-list confirm" @click="updateUser">
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
import { reactive, ref } from 'vue'
import { ElMessage} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import serverCfg from '@/utils/serverCfg'
import uploadCfg from '@/utils/uploadCfg'
import checkForm from '@/utils/checkForm'

const store = useStore()

const formRef = ref(null)
const editFrom = reactive({
	username: null,
	userDscrp: null,
	canSee: null,
	userImg: null
})
const userId = ref(null)

const getUserInfo = async () => {
	window.scrollTo(0, 0)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/home`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		res = res.data.userInfo
		userId.value = res.userId
		editFrom.username = res.username
		editFrom.userDscrp = res.userDscrp
		editFrom.canSee = res.canSee === 1 ? true : false
		editFrom.userImg = res.userImg

		console.log(editFrom)
	} catch (err) {
		ElMessage({ message: '用户登录状态已过期', type: 'warning' })
	}
}
getUserInfo()

const rules = reactive({
	username: [
		{ required: true, message: '请输入昵称', trigger: 'blur' },
		{ min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
		// 检查昵称是否已被使用
		{
			validator: (rule, value, callback) => {
				fetch(`${serverCfg.host}${serverCfg.port}/api/cheakUsername?username=${value}`)
				.then(res => res.json())
				.then(res => {
					if (res.code === 0) {
						callback(new Error(res.msg))
					}
				})
			}, trigger: ['blur']
		}
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



// 用户更新信息提交
const imgFile = ref(null)
const loading = ref(false)
const updateUser = async () => {

	loading.value = true

	// 将图片上传至图床
	var formData = new FormData()
	imgFile.value = files.value[files.value.length - 1]

	if (imgFile.value) {
		formData.append('image', imgFile.value)
		formData.append('key', uploadCfg.key)

		editFrom.userImg = await new Promise((resolve, reject) => {

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
		console.log(editFrom.userImg)
	}



	// 更新用户信息
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/update`, {
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
			store.state.userInfo.username = res.userInfo.username
			window.location.href = '/#/home'
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期' + err, type: 'warning' })
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

/* .confirm {
	background-image: url('../assets/images/lib/confirm.png');
}

.reset {
	background-image: url('../assets/images/lib/reset.png');
} */
</style>
