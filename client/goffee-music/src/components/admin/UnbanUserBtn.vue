<template>
	<el-button link @click="unbanUserVisible = true">
		解封
	</el-button>

	<!-- 解封用户对话框 -->
	<el-dialog v-model="unbanUserVisible" title="解封用户" width="500" :show-close="false" :append-to-body='true'>
		<span>确定要解封该用户吗</span>
		<template #footer>
			<div class="dialog-footer">
				<el-button link @click="unbanUserVisible = false">关闭</el-button>
				<el-button link @click="unbanUser()">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import serverCfg from '@/utils/serverCfg'

const props = defineProps({
	userInfo: Object,
	userId: Number
})

const unbanUserVisible = ref(false)

// 解封用户
const unbanUser = async () => {
	// console.log(props)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/unban`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({ userId: props.userId })
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
			props.userInfo.status = 1
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
	unbanUserVisible.value = false
}

</script>

<style></style>