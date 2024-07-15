<template>
	<div class="page">
		<ManageAside />

		<div class="main-box">
			<div class="main">
				<p class="title">用户列表</p>
				<el-scrollbar>
					<el-table ref="userListRef" :data="userList" class="table">
						<el-table-column fixed prop="userId" label="编号" width="90" />
						<el-table-column prop="username" label="名称" width="180" />
						<el-table-column prop="userDscrp" label="简介" width="600" show-overflow-tooltip />
						<el-table-column label="头像">
							<template #default="scope">
								<ViewImg :imgUrl="scope.row.userImg" />
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态">
							<template #default="scope">
								<el-text type="success" v-if="scope.row.status === 1">正常</el-text>
								<el-text type="danger" v-if="scope.row.status === -1">封禁中</el-text>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="scope">
								<BanUserBtn v-if="scope.row.status === 1" :userInfo="scope.row" :userId="scope.row.userId"/>
								<UnbanUserBtn v-if="scope.row.status === -1" :userInfo="scope.row" :userId="scope.row.userId"/>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import ManageAside from '../../components/admin/ManageAside.vue';
import BanUserBtn from '@/components/admin/BanUserBtn.vue';
import UnbanUserBtn from '@/components/admin/UnbanUserBtn.vue';
import ViewImg from '@/components/admin/ViewImg.vue';
import serverCfg from '../../utils/serverCfg'

const userList = ref(null)
const getUsers = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/userList`, {
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.success) {
			userList.value = res.data
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
}
getUsers()

</script>

<style></style>