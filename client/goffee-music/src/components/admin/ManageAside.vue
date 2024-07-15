<template>
	<el-aside class="manage-aside">
		<el-scrollbar>
			<el-menu :default-openeds="['1', '2', '3', '4']">

				<el-sub-menu index="1">
					<template #title>
						<i>&#xe7aa;</i>管理首页
					</template>
					<el-menu-item-group>
						<RouterLink to="/manage/index"><el-menu-item index="1-1">管理首页</el-menu-item></RouterLink>
					</el-menu-item-group>
				</el-sub-menu>

				<el-sub-menu index="2">
					<template #title>
						<i>&#xe9d4;</i>歌单管理
					</template>
					<el-menu-item-group>
						<RouterLink to="/manage/review"><el-menu-item index="2-1">歌单审核</el-menu-item></RouterLink>
						<RouterLink to="/manage/albumlist"><el-menu-item index="2-2">歌单列表</el-menu-item></RouterLink>
						<RouterLink to="/manage/albumSongs"><el-menu-item index="2-3">歌单歌曲列表</el-menu-item></RouterLink>
					</el-menu-item-group>
				</el-sub-menu>


				<el-sub-menu index="3">
					<template #title>
						<i>&#xe7ce;</i>用户管理
					</template>
					<el-menu-item-group>
						<RouterLink to="/manage/userlist"><el-menu-item index="3-1">用户列表</el-menu-item></RouterLink>
					</el-menu-item-group>
				</el-sub-menu>

				<el-sub-menu index="4">
					<template #title>
						<i>&#xe9c1;</i>操作历史记录
					</template>
					<el-menu-item-group>
						<RouterLink to="/manage/history"><el-menu-item index="4-1">历史记录</el-menu-item></RouterLink>
					</el-menu-item-group>
				</el-sub-menu>


			</el-menu>
		</el-scrollbar>
	</el-aside>
</template>

<script setup>

</script>

<style scoped>
</style>