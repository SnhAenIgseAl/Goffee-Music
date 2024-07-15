<template>
	<el-row class="page">
		<el-col :span="12">
			<div class="page_left-bg"></div>
		</el-col>

		<el-col :span="12">
			<el-form class="form-box" ref="formRef" :model="form" :rules="rules">
				<p class="title">登录</p>

				<!-- 用户名 / 邮箱 -->
				<el-form-item prop="account">
					<el-input class="form-item" v-model="form.account" placeholder="用户名 / 邮箱" maxlength="20" clearable />
				</el-form-item>

				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input class="form-item" v-model="form.password" type="password" placeholder="密码" clearable
						show-password maxlength="16" />
				</el-form-item>

				<el-button link size="large" class="pri-button" @click="checkForm(formRef, doLogin)">立即登录</el-button>
				<el-button link size="large" class="sub-button" @click="toRegister">没有账号？立即注册！</el-button>
			</el-form>
		</el-col>
	</el-row>
</template>

<script setup>
import { reactive, ref } from 'vue'
import serverCfg from '@/utils/serverCfg'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
import checkForm from '@/utils/checkForm'


const form = reactive({
	account: '',
	password: ''
})

const rules = reactive({
	account: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})


const formRef = ref(null)
const doLogin = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success', plain: true, offset: 110 })
			localStorage.setItem('userToken', res.userToken);
			await getSelf()
			window.location.href = '/#/'
		} else {
			ElMessage({ message: res.msg, type: 'error', plain: true, offset: 110 })
		}
	} catch (err) {
		ElMessage({ message: '网络未连接', type: "error" })
	}
}

const store = useStore()
const getSelf = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/self`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.success) {
			store.dispatch('asyncUpdateUserInfo', res.user)
			console.log(store.state.userInfo)
		} else {
			store.dispatch('asyncUpdateUserInfo', null)
		}
	} catch (err) {
		ElMessage({ message: '网络未连接', type: "error" })
	}
}


const toRegister = () => {
	window.location.href = '/#/register'
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