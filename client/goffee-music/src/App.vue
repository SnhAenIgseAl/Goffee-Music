<template>
	<div>
		<Header />
		<RouterView />
		<ControlMenu />
		<div class="fliter"></div>
	</div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue'
import Header from './components/Header.vue'
import ControlMenu from './components/ControlMenu.vue'

</script>

<style scoped>
.fliter {
	position: fixed;
	z-index: 1;
	top: 720px;
	width: 100%;
	height: 720px;
	backdrop-filter: blur(3px);
	background-color: linear-gradient(to top, var(--cl-black-75), var(--lucency));
	;
}
</style>
