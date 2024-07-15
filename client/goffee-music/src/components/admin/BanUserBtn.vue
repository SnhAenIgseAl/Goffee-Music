<template>
	<el-button link @click="banUserVisible = true">
		封禁
	</el-button>

	<!-- 封禁用户原因对话框 -->
	<el-dialog v-model="banUserVisible" title="封禁用户" width="800" :show-close="false" :append-to-body='true'>
		<el-form ref="formRef" :model="banForm" :rules="rules">

			<el-form-item prop="reason">
				<el-select v-model="banForm.reason" placeholder="请选择封禁原因" size="large">
					<el-option v-for="item in banUserReasonOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			
			<el-form-item prop="time">
				<el-select v-model="banForm.time" placeholder="请选择封禁时间" size="large">
					<el-option v-for="item in banUserTimeOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button link @click="banUserVisible = false">关闭</el-button>
				<el-button link @click="checkFrom(formRef, banUser)">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import serverCfg from '@/utils/serverCfg'
import checkFrom from '@/utils/checkForm'
import banUserReasonOptions from '@/utils/banUserOptions/reasonCfg'
import banUserTimeOptions from '@/utils/banUserOptions/timeCfg'

const props = defineProps({
	userInfo: Object,
	userId: Number
})



const formRef = ref(null)
const banUserVisible = ref(false)
const banForm = reactive({
	reason: null,
	time: null
})

const rules = reactive({
	reason: [{ required: true, message: '封禁原因不能为空', trigger: 'blur' }],
	time: [{ required: true, message: '封禁时间不能为空', trigger: 'blur' }]
})



// 封禁用户
const banUser = async () => {
	// console.log(props)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/ban`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({ 
				reason: banForm.reason,
				time: banForm.time,
				userId: props.userId
			})
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
			props.userInfo.status = -1
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
	banUserVisible.value = false
}

</script>

<style></style>