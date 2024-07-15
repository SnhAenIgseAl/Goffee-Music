<template>
	<canvas id="music-visual" ref="musicVisualRef" width="1920" height="1080"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import musicVisual from '../utils/musicVisual'
import { useStore } from 'vuex';

const musicVisualRef = ref(null)

const store = useStore()

watch(() => store.state.songInfo.songType, (newValue, oldValue) => {
	// console.log(newValue)
	if (newValue === '5') {
		musicVisual.install()
	}
})

</script>

<style>
#music-visual {
	position: fixed;
	z-index: 2;
	top: 720px;
	width: 100%;
}
</style>