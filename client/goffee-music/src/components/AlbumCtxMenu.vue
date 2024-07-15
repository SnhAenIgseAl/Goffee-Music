<template>

	<el-popover placement="right" :width="300" trigger="hover">
		<template #reference>
			<el-button link style="margin-right: 16px"><i>&#xe872;</i>更多</el-button>
		</template>
		<ul class="ctx-menu_box" ref="CtxMenuBox">

			<li class="ctx-menu_item" @click="dialogVisible = true"><i>&#xe8ab;</i>删除歌单</li>

			<li class="ctx-menu_item" @click="toEditAlbum"><i>&#xe7a6;</i>编辑歌单</li>
			<li class="btm-line"></li>

			<!-- <li class="ctx-menu_item" @click="shareAlbumImg"><i>&#xe84f;</i>分享歌单（生成海报）</li> -->
			<li class="ctx-menu_item" @click="drawer = true"><i>&#xe84f;</i>分享歌单（生成海报）</li>


			<li class="ctx-menu_item" @click="shareAlbumLink"><i>&#xe844;</i>分享歌单链接</li>
		</ul>
	</el-popover>

	<!-- 删除歌单时的确认对话框 -->
	<el-dialog v-model="dialogVisible" title="提示" width="500" :show-close="false" :append-to-body="true">
		<span>确定删除此歌单吗</span>
		<template #footer>
			<div class="dialog-footer">
				<el-button link @click="dialogVisible = false">取消</el-button>
				<el-button link @click="delAlbum">确定</el-button>
			</div>
		</template>
	</el-dialog>

	<!-- 绘制歌单海报的抽屉 -->
	<el-drawer 
		v-model="drawer"
		class="drawer"
		:with-header="false"
		:append-to-body="true"
		:style="{overflow: 'hidden'}"
		@opened="shareAlbumImg"
	>
		<canvas ref="shareRef" class="share-album"></canvas>
	</el-drawer>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';
import serverCfg from '@/utils/serverCfg';
import shareAlbum from '@/utils/shareAlbum';

const props = defineProps({
	albumId: Number,
	albumList: Object
})



// 删除歌单
var dialogVisible = ref(false)
const delAlbum = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/delAlbum?albumId=${props.albumId}`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.code === 200) {
			ElMessage({ message: res.msg, type: 'success' })
			for (let i = 0; i < props.albumList.length; i++) {
				if (props.albumList[i].albumId === props.albumId) {
					props.albumList.splice(i, 1)
				}
			}
		} else {
			ElMessage({ message: res.msg, type: 'error' })
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期' + err, type: 'error' })
	}
	dialogVisible.value = false
}



// 跳转至编辑歌单页面
const toEditAlbum = () => {
	window.location.href = `/#/editAlbum/${props.albumId}`
}



// 分享歌单海报
var drawer = ref(false)
const shareRef = ref(null)
const shareAlbumImg = () => {

	// 海报缩放比例，高度与浏览器高度保持一致
	let scale = window.innerHeight / 1800
	shareRef.value.style.height = 1800 * scale + 'px'
	shareRef.value.style.width = 1080 * scale + 'px'
	shareAlbum.install(props.albumId, shareRef.value)
}



// 分享歌单链接
const shareAlbumLink = async () => {
	await navigator.clipboard.writeText('window.location.hostname + /album/ + albumId')
		.then(() => {
			ElMessage({ message: '链接已复制到剪切板', type: 'success' })
		})
		.catch((err) => {
			ElMessage({ message: '链接复制到剪切板失败' + err, type: 'warning' })
		})
}

</script>

<style scoped>
.ctx-menu_box {
	list-style: none;
	width: 300px;
	height: auto;
	margin-left: -12px;
	padding: 8px;
	left: 180px;
	bottom: 108px;
	background: var(--cl-black-50);
	backdrop-filter: blur(30px);
	border-radius: 5px;
	transition: unset;

	.btm-line {
		margin: 0.8rem 0;
		border-bottom: 2px solid var(--cl-white-10);
	}

	.ctx-menu_item {
		width: 100%;
		height: 4.5rem;
		line-height: 4.5rem;
		padding: 0 8px;
		color: var(--subsubtitleColor);
		font-size: var(--subsubtitleSize);
		border-radius: 5px;

		&:hover {
			background: var(--cl-white-10);
			cursor: pointer;
		}
	}
}

.share-album {
	width: 1080px;
	height: 1800px;
	background: #333;
}
</style>