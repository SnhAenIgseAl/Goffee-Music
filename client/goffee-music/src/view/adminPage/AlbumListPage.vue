<template>
	<div class="page">
		<ManageAside />

		<div class="main-box">
			<div class="main">

				<p class="title">歌单列表</p>

				<el-scrollbar>
					<el-table ref="albumListRef" :data="albumList" :highlight-current-row="true" class="table">
						
						<el-table-column fixed prop="albumId" label="编号" width="90" />
						<el-table-column prop="albumName" label="名称" width="180" />
						<el-table-column prop="albumDscrp" label="简介" width="300" show-overflow-tooltip />
						<el-table-column label="封面">
							<template #default="scope">
								<ViewImg :imgUrl="scope.row.albumImg" />
							</template>
						</el-table-column>
						<el-table-column prop="createdBy" label="创建者" />
						<el-table-column prop="status" label="状态">
							<template #default="scope">
								<el-text type="success" v-if="scope.row.status === 1">审核通过</el-text>
								<el-text type="warning" v-if="scope.row.status === 0">审核中</el-text>
								<el-text type="warning" v-if="scope.row.status === -1">修改中</el-text>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="scope">
								<AgainstAlbumBtn 
									v-if="scope.row.status === 1" 
									:index="scope.$index" 
									:albumInfo="scope.row" 
									:albumId="scope.row.albumId" 
								/>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
			</div>
		</div>

	</div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus'
import ManageAside from '../../components/admin/ManageAside.vue';
import AgainstAlbumBtn from '@/components/admin/AgainstAlbumBtn.vue';
import ViewImg from '@/components/admin/ViewImg.vue';
import serverCfg from '../../utils/serverCfg'

const albumList = ref(null)
const getAlbums = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/albumList`, {
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.success) {
			albumList.value = res.data
		}
	} catch (err) {
		ElMessage({ message: '登录状态已过期', type: 'warning' })
	}
}
getAlbums()

</script>

<style></style>