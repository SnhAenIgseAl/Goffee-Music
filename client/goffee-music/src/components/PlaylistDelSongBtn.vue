<template>
	<el-button link @click="delSong"><i>&#xe8ab;</i>删除</el-button>
</template>

<script setup>
import serverCfg from '@/utils/serverCfg';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const props = defineProps({
	index: Number
})

const store = useStore()
const delSong = async () => {
	// console.log(props.index)
	store.dispatch('asyncDelSongFromPlaylist', props.index)
	ElMessage({message: '从播放列表删除成功', type: 'success'})
}

</script>

<style>

</style>