import { createWebHashHistory, createRouter, useRoute } from 'vue-router'
import serverCfg from './utils/serverCfg'
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const routes = [
	
	// 前台用户页面
	{
		path: '/', component: () => import('./view/IndexPage.vue')
	},
	{
		path: '/search', props: true, component: () => import('./view/SearchPage.vue')
	},
	{
		path: '/login', component: () => import('./view/LoginPage.vue')
	},
	{
		path: '/register', component: () => import('./view/RegisterPage.vue')
	},
	{
		path: '/home', 
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/HomePage.vue')
	},
	{
		path: '/profile/:username', 
		name: 'profile',
		component: () => import('./view/UserProfilePage.vue')
	},
	{
		path: '/edit', 
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/UserEditPage.vue')
	},
	{
		path: '/setPassword', 
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/UserSetPwdPage.vue')
	},
	{
		path: '/setEmail', 
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/UserSetEmailPage.vue')
	},
	{
		path: '/remake', 
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/UserRemakePage.vue')
	},
	{
		path: '/self/album/:albumId', 
		name: 'selfAlbum',
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/UserAlbumPage.vue')
	},
	{
		path: '/album/:albumId', 
		name: 'album',
		component: () => import('./view/AlbumPage.vue')
	},
	{
		path: '/addAlbum', 
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/AlbumAddPage.vue')
	},
	{
		path: '/editAlbum/:albumId', 
		name: 'editAlbum',
		beforeEnter: (to, from, next) => {
			if (!useStore().state.userInfo) {
				next({ path: '/login' })
			} else if (useStore().state.userInfo.status === -1) {
				next({ path: '/401' })
			} else {
				next()
			}
		},
		component: () => import('./view/AlbumEditPage.vue')
	},


	// 后台管理页面
	{
		path: '/manage', 
		beforeEnter: (to, from, next) => {
			if (useStore().state.userInfo.userRank === 1) {
				next({ path: '/login' })
			} else {
				next()
			}
		},
		children: [
			{
				path: 'index',
				component: () => import('./view/adminPage/IndexPage')
			},
			{
				path: 'review',
				component: () => import('./view/adminPage/ReviewAlbumPage')
			},
			{
				path: 'albumList',
				component: () => import('./view/adminPage/AlbumListPage')
			},
			{
				path: 'albumSongs',
				component: () => import('./view/adminPage/AlbumSongsPage')
			},
			{
				path: 'userList',
				component: () => import('./view/adminPage/UserListPage')
			},
			{
				path: 'history',
				component: () => import('./view/adminPage/ManageHistoryPage')
			}
		]
		
	},
	{
		path: '/401', component: () => import('./view/401Page.vue')
	},
	{
		path: '/:pathMatch(.*)', component: () => import('./view/404Page.vue')
	},
]



const router = createRouter({
	history: createWebHashHistory(),
	routes
})



router.beforeEach(async (to, from, next) => {

	// 页面切换时回到最左边
	if (to.path !== from.path) {
		window.scrollTo(0, 0);
	}

	// // 无需登录能访问的页面
	// if (!localStorage.getItem('userToken') && 
	// 	(to.path === '/' ||
	// 	to.path === '/login' ||
	// 	to.path === '/register' ||
	// 	to.path === '/search' ||
	// 	to.name === 'album' || 
	// 	to.name === 'pofile')
	// ){
	// 	next()

	// // 没有登陆过就跳转到登录页面
	// } else {
	// 	next({ path: '/login' })
	// }
	next()
})



export default router