<template>
	<el-row class="page">
		<el-col :span="12">
			<div class="page_left-bg"></div>
		</el-col>

		<el-col :span="12">
			<div class="info-box">
				<p class="title">404 页面未找到</p>
				<p class="subtitle">你来到了一个不为人知的地方……</p>
				<el-button link @click="goback" class="sub-button">返回上一页面</el-button>
			</div>
		</el-col>
	</el-row>
</template>

<script setup>

const goback = () => {
	window.history.go(-1)
}

</script>

<style scoped>
.info-box {
	width: 720px;
	height: 240px;
	margin: 0 auto 30px;
}

.sub-button {
	float: unset;
	padding: 30px 0 !important;
	font-size: var(--subtitleSize) !important;
	color: var(--subsubtitleColor) !important;

	&:hover {
		text-shadow: var(--blueShadow);
	}
}


</style>