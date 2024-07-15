<template>
	<div class="wallpaper">

		<!-- 基本信息 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>01<br><br>
				填写基本信息
			</p>
		</div>
		<div class="container text-info">
			<el-form :model="info_1" :rules="rules_1">
				<!-- <UsernameInput @returnUsername="getUsername" /> -->
				<el-form-item prop="username">
					<el-input v-model="info_1.username" maxlength="18" clearable placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="info_1.password" type="password" show-password maxlength="16"
						placeholder="密码"></el-input>
				</el-form-item>
				<el-form-item prop="repassword">
					<el-input v-model="info_1.repassword" type="password" show-password maxlength="16"
						placeholder="确认密码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="info_1.userDscrp" type="textarea" clearable placeholder="用户描述" :rows="7"></el-input>
				</el-form-item>
				<el-form-item>
					<el-switch v-model="info_1.canSee" size="large" active-text="主页所有人可见" inactive-text="主页仅自己可见" />
				</el-form-item>
			</el-form>
		</div>

		<!-- 绑定邮箱 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>02<br><br>
				绑定邮箱
			</p>
		</div>
		<div class="container text-info">
			<el-form ref="formRef" :model="info_2" :rules="rules_2">
				<el-form-item prop="email">
					<el-input v-model="info_2.email" placeholder="邮箱"></el-input>
				</el-form-item>
				<el-form-item prop="code">
					<el-input v-model="info_2.code" placeholder="邮箱验证码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button link @click="sendEmailCode">发送验证码</el-button>
				</el-form-item>
				<el-form-item>
					<el-button link @click="verifyEmailCode">验证</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!-- 上传头像 -->
		<div class="container text-info">
			<p class="title">
				<i>&#xe9be;</i>03<br><br>
				上传头像
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
				<i>&#xe9be;</i>04<br><br>
				确定好了吗
			</p>
		</div>
		<div v-loading="loading" class="container song-list confirm" @click="checkForm(formRef, doRegister)">
			<div class="con-title">
				<p class="subtitle">
					<i>&#xe886;</i>确定
				</p>
			</div>
		</div>
		<div class="container song-list reset" @click="reset">
			<div class="con-title">
				<p class="subtitle">
					<i>&#xe79b;</i>重新开始
				</p>
			</div>
		</div>

	</div>
</template>

<script setup>
import { provide, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import serverCfg from '@/utils/serverCfg';
import uploadCfg from '@/utils/uploadCfg';
import checkForm from '@/utils/checkForm';

const formRef = ref(null);
const info_1 = reactive({
	username: '',
	password: '',
	repassword: '',
	userDscrp: '',
	canSee: true,
	userImg: ''
})
const rules_1 = reactive({
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
		// 检查用户名是否已被使用
		{
			validator: (rule, value, callback) => {
				fetch(`${serverCfg.host}${serverCfg.port}/api/cheakUsername?username=${value}`)
				.then(res => res.json())
				.then(res => {
					if (res.code === 0) {
						callback(new Error(res.msg))
					}
				})
			}
		}
	],
	password: [
		{ required: true, message: '密码不能为空', trigger: 'blur' },
		{ min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
	],
	repassword: [
		{ required: true, message: '密码不能为空', trigger: 'blur' },
		{ min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
		// 验证两次密码是否输入一致
		{
			validator: (rule, value, callback) => {
				if (value !== info_1.password) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			}, trigger: 'blur'
		}
	]

})

const info_2 = reactive({
	email: '',
	code: ''
})
const rules_2 = reactive({
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
	],
	code: [
		{ required: true, message: '请输入验证码', trigger: 'blur' },
		{ min: 6, max: 6, message: '请输入6位验证码', trigger: ['blur', 'change'] }
	]
})



// 发送邮箱验证码
const sendEmailCode = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/getEmailCode?email=${info_2.email}`)
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '网络未连接', type: 'warning' })
	}
}



// 验证邮箱
const verifyEmailCode = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/verifyRegister`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(info_2)
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
			localStorage.setItem('emailToken', res.emailToken)
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '网络未连接', type: 'error' })
	}
}



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



// 注册信息提交
const imgFile = ref(null)
const loading = ref(false)
const doRegister = async () => {

	loading.value = true

	// 将图片上传至图床
	var formData = new FormData()
	imgFile.value = files.value[files.value.length - 1]

	if (imgFile.value) {
		formData.append('image', imgFile.value)
		formData.append('key', uploadCfg.key)

		info_1.userImg = await new Promise((resolve, reject) => {
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
	}
	console.log(info_1, info_2)


	// 注册
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/register`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('emailToken')}`
			},
			body: JSON.stringify({ info_1, info_2})
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
			localStorage.setItem('emailToken', null)
			window.location.href = '/#/index'
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: err, type: 'warning' })
	}
}

</script>

<style>

</style>