let client = require('scp2')

let server = {
  default: {
    host: "0.0.0.0",
    username: "root",
    password: "123456",
    path: "/www/project"
  },
  test: {
    host: "0.0.0.0",
    username: "root",
    password: "123456",
    path: "/www/project"
  }
}

let serverConfig = process.env.VUE_APP_MODE ? server[process.env.VUE_APP_MODE] : server.default
console.log('uploading...')
client.scp("./dist/", serverConfig, (err) => {
  console.log(err || 'upload success')
})