Goffee Music  
--  
过肺音乐  
  
这是我第一次整全栈项目，如有代码不规范的地方还请见谅。  
服务端采用MVC设计模式。
  
技术栈：Vue3 丨 Vue Router 丨 Vuex 丨 ElementPlus 丨 Fetch 丨 Express 丨 Redis
    
声明
--  
1. 本项目不提供任何音乐（含VIP）下载、存储功能。
2. 本项目不收集任何人的邮箱、token，所需的项目配置均在**项目配置**一栏列出。
3. 本项目所使用的api仅做学习交流用途。
  
安装网易云API依赖  
--
切换至网易云API目录并安装依赖  
`cd client\goffee-music\public\api\NeteaseCloudMusicApi`  
`npm i`  
  
启动服务  
`node app.js`  
  
安装客户端依赖  
--
切换至客户端目录并安装依赖  
`cd client\goffee-music`  
`npm i`  
  
启动服务  
`npm run serve`

安装服务端依赖  
--
切换至服务端目录  
`cd server`  
`npm i`  
  
启动服务  
`node app.js`  

项目配置
--
本项目Node版本 v18.20.3  
`.\client\goffee-music\src\utils\serverCfg.js` 服务端地址及端口  
`.\client\goffee-music\src\utils\uploadCfg.js` 图床api及key（本项目使用的是ImgBB图床）  
`.\server\model\emailCfg.js` 邮件发送的邮箱及key  
`.\server\model\mysqlCfg.js` Mysql数据库配置  
`.\server\model\redisCfg.js` Redis数据库配置  
`.\server\model\biliTicketCfg.js` 噼哩噼哩ticket 

  
特别感谢
--
NeteaseCloudMusicApi forked from [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)  
[哔哩哔哩API收集整理](https://github.com/SocialSisterYi/bilibili-API-collect)
