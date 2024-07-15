<template>
	<el-row class="page">
		<el-col :span="12">
			<div class="page_left-bg"></div>
		</el-col>

		<el-col :span="12">
			<el-form ref="formRef" class="form-box" :rules="rules" :model="emailForm">
				<p class="title">修改邮箱</p>

				<!-- 邮箱 -->
				<el-form-item prop="email">
					<el-input class="form-item" v-model="emailForm.email" placeholder="邮箱" clearable />
				</el-form-item>

				<!-- 验证码 -->
				<el-form-item prop="code">
					<el-input class="form-item" v-model="emailForm.code" placeholder="验证码" maxlength="6" />
				</el-form-item>
				<el-button link size="large" class="pri-button" @click="setEmailCode">发送验证码</el-button>
				<el-button link size="large" class="sub-button" @click="checkFrom(formRef, setEmail)">修改</el-button>
			</el-form>
		</el-col>
	</el-row>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import serverCfg from '@/utils/serverCfg';
import checkFrom from '@/utils/checkForm';

const formRef = ref(null)
const emailForm = reactive({
	email: '',
	code: ''
})

const rules = reactive({
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
	],
	code: [
		{ required: true, message: '请输入验证码', trigger: 'blur' },
		{ min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur' },
	]
})



// 发送邮箱验证码
const setEmailCode = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/getEmailCode?email=${emailForm.email}`)
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



// 修改邮箱
const setEmail = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/setEmail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify(emailForm)
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
}

</script>

<style>

.pri-button {
	padding: 30px 0 !important;
	font-size: var(--subtitleSize) !important;
	color: var(--subtitleColor) !important;

	&:hover {
		text-shadow: var(--purpleShadow);
	}
}

.sub-button {
	padding: 30px 0 !important;
	font-size: var(--subtitleSize) !important;
	color: var(--subsubtitleColor) !important;
	float: right;

	&:hover {
		text-shadow: var(--blueShadow);
	}
}
</style>