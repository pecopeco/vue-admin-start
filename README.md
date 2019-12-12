# vue-admin-manager

> 后台管理系统，基于 vue-element-admin 搭建，权限控制由后端返回用户可访问页面表，前端重置本地路由表，权限控制页面可将权限控制结果提交后端更新，目前只支持到二级菜单

### 安装
```
npm i
```

### 运行
```
npm start
```

### 打包

测试环境：
```
npm run build:test
```

生产环境：
```
npm run build
```

### 部署


部署到测试环境：
```
npm run prod:test
```

部署到生产环境：
```
npm run prod
```

部署服务器配置 prod.js：
```
...
let server = {
  default: {  // 正式环境
    host: "0.0.0.0",  // 服务器IP地址
    username: "root",  // 账号
    password: "123456",  // 密码
    path: "/www/project"  // 服务器项目路径
  },
  test: {},    // 测试环境
}
...
```

