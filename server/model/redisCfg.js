const redis = require('redis')



const client = redis.createClient({
	host: '127.0.0.1',
	port: 6379,
})
client.on('connect', () => {
	console.log('Redis连接成功')
})
client.on('error', (err) => {
	console.log('Redis错误: ' + err)
})
client.connect()



module.exports = client