<template>
	<el-row class="page">
		<el-col :span="12">
			<div class="page_left-bg"></div>
		</el-col>

		<el-col :span="12">
			<el-form ref="formRef" :model="remakeForm" :rules="rules" class="form-box" >
				<p class="title">账号注销</p>

				<p class="subtitle">
					注销后账号所创建歌单及歌曲将全部删除。<br />
					确定注销账号请在下方输入“我确认注销账号”
				</p>

				<el-form-item prop="txt">
					<el-input class="form-item" v-model="remakeForm.txt" type="text" />
				</el-form-item>

				<!-- <el-button link size="large" class="pri-button" @click="checkFrom(formRef, remake)">注销</el-button> -->
				<el-button link size="large" class="pri-button" @click="dialogVisible = true">注销</el-button>
				
				<!-- 注销时的确认对话框 -->
				<el-dialog v-model="dialogVisible" width="500" :show-close="false" :append-to-body="true">
					<span>确定注销账号吗</span>
					<template #footer>
						<div class="dialog-footer">
							<el-button link @click="dialogVisible = false">取消</el-button>
							<el-button link @click="checkFrom(formRef, remake)">确定</el-button>
						</div>
					</template>
				</el-dialog>
			</el-form>
		</el-col>
	</el-row>
</template>

<script setup>
import { reactive, ref } from 'vue';
import serverCfg from '@/utils/serverCfg';
import { ElMessage } from 'element-plus';
import checkFrom from '@/utils/checkForm';
import { useStore } from 'vuex';
import store from '@/store';

const formRef = ref(null)
const remakeForm = reactive({
	txt: ''
})

const rules = reactive({
	txt: [
		{ required: true, message: '确认信息不能为空', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (value !== "我确认注销账号") {
					callback(new Error('确认信息不正确'))
				} else {
					callback()
				}
			}, trigger: 'blur'
		}
	],
})



// 注销账号
const dialogVisible = ref(false)
const remake = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/remake`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({remakeForm})
		})
		res = await res.json()
		if (res.success) {
			ElMessage({message: res.msg, type: 'success'})
			window.location.href = '/#/'

			// 清空用户信息
			localStorage.setItem('userToken', null)
			store.dispatch('asyncUpdateUserInfo', null)
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