<template>
	<el-button link @click="againstAlbumVisible = true">
		退回
	</el-button>

	<!-- 歌单退回原因对话框 -->
	<el-dialog v-model="againstAlbumVisible" title="退回歌单" width="800" :show-close="false" :append-to-body="true">
		<el-form ref="formRef" :model="againstForm" :rules="rules">
			<el-form-item prop="reason">
				<el-select v-model="againstForm.reason" placeholder="请选择退回原因" size="large">
					<el-option v-for="item in againstReasonOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button link @click="againstAlbumVisible = false">关闭</el-button>
				<el-button link @click="checkFrom(formRef, againstAlbum)">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import serverCfg from '../../utils/serverCfg'
import againstReasonOptions from '../../utils/againstOptions/reason'
import checkFrom from '@/utils/checkForm';

const props = defineProps({
	index: Number,
	albumInfo: Object,
	albumId: Number
})



const formRef = ref(null)
const againstAlbumVisible = ref(false)
const againstForm = reactive({
	reason: null
})

const rules = reactive({
	reason: [{ required: true, message: '退回原因不能为空', trigger: 'blur' }]
})


// 退回歌单
const againstAlbum = async () => {
	console.log(props)
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/against`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('userToken')}`
			},
			body: JSON.stringify({ 
				reason: againstForm.reason,
				albumInfo: props.albumInfo
			})
		})
		res = await res.json()
		if (res.success) {
			ElMessage({ message: res.msg, type: 'success' })
			// props.albumInfo.status = -1
			props.albumList.splice(props.index, 1)
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
	againstAlbumVisible.value = false
}

</script>

<style></style>