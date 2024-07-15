<template>
	<el-button link @click="viewImg">查看</el-button>

	<el-dialog v-model="dialogVisible" width="800" :show-close="false" :append-to-body="true">
		<img :src="userImgSrc" width="768" />
		<template #footer>
			<div class="dialog-footer">
				<el-button link @click="dialogVisible = false">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	imgUrl: String
})


// 查看用户头像
const dialogVisible = ref(false)
const userImgSrc = ref(null)
const viewImg = async () => {
	dialogVisible.value = true
	userImgSrc.value = `https://images.weserv.nl/?url=${props.imgUrl}`
}
</script>