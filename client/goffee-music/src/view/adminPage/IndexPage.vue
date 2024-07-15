<template>
	<div class="page">
		<ManageAside />

		<div class="main-box">
			<div class="main">

				<el-scrollbar v-if="total">
					<p class="title">歌单数据</p>
					<el-row class="total-info">
						<el-col :span="7" class="total-info_item">
							<p class="subsubtitle">待审核的歌单数量</p>
							<p class="title total-info_number">{{ total.review }}</p>
						</el-col>
						<el-col :span="7" class="total-info_item">
							<p class="subsubtitle">修改中的歌单数量</p>
							<p class="title total-info_number">{{ total.alter }}</p>
						</el-col>
						<el-col :span="7" class="total-info_item">
							<p class="subsubtitle">已审核通过的歌单数量</p>
							<p class="title total-info_number">{{ total.approve }}</p>
						</el-col>
					</el-row>

					<p class="title">用户数据</p>
					<el-row class="total-info">
						<el-col :span="7" class="total-info_item">
							<p class="subsubtitle">新注册的用户量</p>
							<p class="title total-info_number">1</p>
						</el-col>
						<el-col :span="7" class="total-info_item">
							<p class="subsubtitle">被封禁的用户数量</p>
							<p class="title total-info_number">{{ total.banUser }}</p>
						</el-col>
						<el-col :span="7" class="total-info_item">
							<p class="subsubtitle">总用户数量</p>
							<p class="title total-info_number">{{ total.user }}</p>
						</el-col>
					</el-row>
				</el-scrollbar>

			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import serverCfg from '@/utils/serverCfg';
import ManageAside from '../../components/admin/ManageAside.vue'
import { ElMessage } from 'element-plus';

const total = ref(null)
const getTotalAlbums = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/total`, {
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.success) {
			total.value = res.data
		}
	} catch (error) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
}
getTotalAlbums()

</script>

<style scoped>
.total-info {
	margin-bottom: 30px;
	justify-content: space-between;
	/* background-image: linear-gradient(to right, var(--purple), var(--blue)); */
}

.total-info_item {
	margin: 30px 0;
	padding: 18px 30px;
	color: var(--subsubtitleColor);
	font-size: var(--subsubtitleSize);
	background-image: linear-gradient(to right, #001c3c, #38193c);
	border-radius: 15px;
}

.total-info_number {
	margin-top: 1.8rem;
}
</style>