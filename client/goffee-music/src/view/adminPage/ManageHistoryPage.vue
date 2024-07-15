<template>
	<div class="page">
		<ManageAside />

		<div class="main-box">
			<div class="main">
				<p class="title">操作历史记录</p>

				<el-scrollbar>
					<el-timeline class="table">
						<el-timeline-item v-for="(item, index) in historyList" :key="index" 
							:timestamp="item.time"
							placement="top"
						>

							<!-- 绿色卡片，歌单审核通过、用户解封之类 -->
							<el-card v-if="item.type === 'A1' || item.type === 'U1'" class="card-success">
								<p class="subtitle">{{ item.username }}</p>
								<el-text type="success" v-if="item.type === 'A1'">审核通过歌单</el-text>
								<el-text type="success" v-if="item.type === 'U1'">解封用户</el-text>
								<el-text type="info">ID：{{ item.targetId }}</el-text>
								<el-text type="info" v-if="item.reason">原因：{{ item.reason }}</el-text>
							</el-card>

							<!-- 橙黄色卡片，退回歌单之类 -->
							<el-card v-if="item.type === 'A-1'" class="card-warning">
								<p class="subtitle">{{ item.username }}</p>
								<el-text type="warning">退回歌单</el-text>
								<el-text type="info">ID：{{ item.targetId }}</el-text>
								<el-text type="info" v-if="item.reason">原因：{{ item.reason }}</el-text>
							</el-card>

							<!-- 红色卡片，封禁用户之类 -->
							<el-card v-if="item.type === 'U-1'" class="card-danger">
								<p class="subtitle">{{ item.username }}</p>
								<el-text type="danger">封禁用户</el-text>
								<el-text type="info">ID：{{ item.targetId }}</el-text>
								<el-text type="info" v-if="item.reason">原因：{{ item.reason }}</el-text>
							</el-card>

						</el-timeline-item>
					</el-timeline>
				</el-scrollbar>
			</div>
		</div>

	</div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import ManageAside from '../../components/admin/ManageAside.vue';
import serverCfg from '../../utils/serverCfg'

const historyList = ref(null)
const getManageHistory = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/history`, {
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.success) {
			historyList.value = res.data

			// 处理一下日期格式
			for (let i  = 0; i < historyList.value.length; i++) {
				historyList.value[i].time = new Date(historyList.value[i].time * 1000).toLocaleString()
			}
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
}
getManageHistory()

</script>

<style scoped>

.card-success {
	background-image: linear-gradient(to right, #133c00, #529b2e);
}

.card-warning {
	background-image: linear-gradient(to right, #3C2E00, #b88230);
}

.card-danger {
	background-image: linear-gradient(to right, #3C0000, #c45656);
}

</style>