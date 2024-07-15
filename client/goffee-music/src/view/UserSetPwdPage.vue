<template>
	<el-row class="page">
		<el-col :span="12">
			<div class="page_left-bg"></div>
		</el-col>

		<el-col :span="12">
			<el-form ref="formRef" class="form-box" :rules="rules" :model="pwdForm">
				<p class="title">修改密码</p>

				<!-- 新密码 -->
				<el-form-item prop="password">
					<el-input class="form-item" v-model="pwdForm.password" type="password" placeholder="新密码" maxlength="18"
						show-password clearable />
				</el-form-item>

				<!-- 重复密码 -->
				<el-form-item prop="repassword">
					<el-input class="form-item" v-model="pwdForm.repassword" type="password" placeholder="重复密码"
						maxlength="18" />
				</el-form-item>

				<el-button link size="large" class="pri-button" @click="checkFrom(formRef, setPwd)">修改</el-button>
			</el-form>
		</el-col>
	</el-row>
</template>

<script setup>
import { reactive, ref } from 'vue';
import serverCfg from '@/utils/serverCfg';
import { ElMessage } from 'element-plus';
import checkFrom from '@/utils/checkForm';

const formRef = ref(null)
const pwdForm = reactive({
	password: '',
	repassword: ''
})

const rules = reactive({
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
				if (value !== pwdForm.password) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			}, trigger: 'blur'
		}
	]
})



const setPwd = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/setPwd`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify(pwdForm)
		})
		res = await res.json()
		if (res.code === 200) {
			ElMessage({message: res.msg, type: 'success'})
			window.location.href = '/#/home'
		} else {
			ElMessage({message: res.msg, type: 'error'})
		}
	} catch (err) {
		ElMessage({message: '登录状态已过期', type: 'warning'})
	}
}

</script>



<style >

.pri-button {
	padding: 30px 0 !important;
	font-size: var(--subtitleSize) !important;
	color: var(--subtitleColor) !important;

	&:hover {
		text-shadow: var(--purpleShadow);
	}
}
</style>