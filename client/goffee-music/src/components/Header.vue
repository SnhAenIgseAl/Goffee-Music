<template>
	<el-row class="header">
		<el-col :span="12">
			<RouterLink to="#" @click="goback" class="link">
				<i>&#xe857;</i>返回
			</RouterLink>
			<el-divider direction="vertical" />

			<RouterLink to="/" class="link primary">
				<i>&#xe801;</i>Goffee Music
			</RouterLink>
			<RouterLink v-if="store.state.userInfo" to="/home" class="link">
				<i>&#xe7ce;</i>{{ store.state.userInfo.username }}
			</RouterLink>
			<RouterLink v-if="store.state.userInfo && store.state.userInfo.userRank > 1" to="/manage/index" class="link">
				<i>&#xe7a3;</i>上朝
			</RouterLink>
			<RouterLink v-if="store.state.userInfo" to="/" class="link" @click="logout">
				<i>&#xe9a2;</i>登出
			</RouterLink>
			<RouterLink v-else to="/login" class="link">
				<i>&#xe9a2;</i>登录
			</RouterLink>
		</el-col>

		<el-col :span="12">

			<!-- 搜索框 -->
			<el-form ref="formRef" :model="serchForm" :rules="rules">
				<el-row class="search-box">

					<el-col :span="15">
						<el-form-item prop="keyword">
							<el-input v-model="serchForm.keyword" placeholder="请输入歌曲" size="large" clearable class="serch-input"/>
						</el-form-item>
					</el-col>

					<el-col :span="6">
						<el-form-item>
							<el-select v-model="serchForm.songType" placeholder="请选择音乐平台" size="large">
								<el-option v-for="item in searchOptions" :key="item.value" :label="item.label"
									:value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="3" class="search-button">
						<el-button size="large" link @click="checkForm(formRef, searchSong)"><i>&#xe9a0;</i>搜索</el-button>
					</el-col>
				</el-row>
			</el-form>

		</el-col>
	</el-row>
</template>

<script setup>
import { reactive, watch, onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import serverCfg from '@/utils/serverCfg'
import checkForm from '@/utils/checkForm'
import { useStore } from 'vuex';

const formRef = ref(null)
const serchForm = reactive({
	keyword: '',
	songType: ref('1')
})

const searchOptions = [{
	value: '1',
	label: '网易云音乐',
}, {
	value: '2',
	label: '酷狗音乐',
}, {
	value: '3',
	label: '酷我音乐',
}, {
	value: '4',
	label: '哔哩哔哩',
}]

const rules = reactive({
	keyword: [{ required: true, message: '请输入歌曲', trigger: 'focus' }]
})


// 监听键盘回车键，回车键自动搜索
const handleKeydown = (e) => {
	if (e.key === 'Enter') {
		checkForm(formRef.value, searchSong)
	}
}

onMounted(() => {
	window.addEventListener('keydown', handleKeydown);
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown);
})



// 搜索歌曲
function searchSong() {
	window.location.href = '/#/search?keyword=' + serchForm.keyword + '&songType=' + serchForm.songType
}



// 检查登录状态
const store = useStore()
const user = ref(null)
const checkLogin = async () => {
	console.log(localStorage.getItem('userToken'))
	try {
		let res = await fetch(`${serverCfg.host}${serverCfg.port}/self`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
		})
		res = await res.json()
		if (res.success) {
			user.value = res.user
			store.dispatch('asyncUpdateUserInfo', res.user)
			// console.log(store.state.userInfo)
		} else {
			user.value = null
			store.dispatch('asyncUpdateUserInfo', null)
		}
	} catch (err) {
		ElMessage({ message: '网络未连接', type: "error" })
	}
}
checkLogin()


// 登出
const logout = async () => {
	localStorage.removeItem('userToken')
	store.dispatch('asyncUpdateUserInfo', null)
	await checkLogin()
}


// 返回
const goback = () => {
	window.history.go(-1);
}

</script>

<style >
.header {
	position: fixed;
	z-index: 9;
	width: 100%;
	min-width: 960px;
	--header-height: 90px;
	padding: 0 6rem;
	height: var(--header-height);
	border-bottom: 2px solid var(--cl-white-25);
}

.link {
	text-decoration: none;
	line-height: var(--header-height);
	margin: 0 1rem;
}

.primary:hover {
	text-shadow: var(--purpleShadow);
}

.search-box {
	justify-items: center;
	align-items: center;
	height: var(--header-height);

	.search-input {
		min-width: 200px;
	}
}

.search-button {
	text-align: center;

	&:hover {
		text-shadow: var(--blueShadow) !important;
	}
}

.search-option {
	background: #333 !important;
}

.el-form-item {
	margin-bottom: unset !important;
}
</style>