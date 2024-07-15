<template>
	<div class="page">
		<ManageAside />

		<div class="main-box">
			<div class="main">
				<p class="title">歌单歌曲列表</p>
				<el-scrollbar>
					<el-table :data="albumList" class="table">
						<el-table-column type="expand">
							<template #default="props">
								<el-table :data="props.row.songList">
									<el-table-column label="歌曲名称" prop="songName" />
									<el-table-column label="歌曲来源" prop="songType">
										<template #default="scope">
											<el-text v-if="scope.row.songType === '1'" type="info">网易云</el-text>
											<el-text v-if="scope.row.songType === '2'" type="info">酷狗音乐</el-text>
											<el-text v-if="scope.row.songType === '3'" type="info">酷我音乐</el-text>
											<el-text v-if="scope.row.songType === '4'" type="info">哔哩哔哩</el-text>
										</template>
									</el-table-column>

								</el-table>
							</template>
						</el-table-column>

						<el-table-column label="歌单编号" prop="albumId" width="90"/>
						<el-table-column label="歌单名称" prop="albumName" />
						<el-table-column label="创建者" prop="createdBy" />
					</el-table>
				</el-scrollbar>
			</div>
		</div>

	</div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import serverCfg from '../../utils/serverCfg.js';
import ManageAside from '../../components/admin/ManageAside.vue';

const albumList = ref(null)
const getAlbumList = async () => {
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/api/admin/albumSongs`, {
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
getAlbumList()

</script>

<style></style>