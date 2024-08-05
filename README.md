# vue-admin-template

### vue 中使用 Alipayer,播放 rtmp,m3u8,mp4 视频



基于以下二次开发

vue2后台管理模板：https://github.com/PanJiaChen/vue-admin-template

阿里云vue依赖：https://github.com/langyuxiansheng/vue-aliplayer-v2

阿里云接口：https://help.aliyun.com/zh/vod/developer-reference/api-operations?spm=a2c4g.11186623.6.1085.36fc6fc57WKZ5P

**预览示例1**

这个示例为直播模式，点击复选框会销毁

![1722846605687](assets/1722846605687.png)

**预览示例2**

这个示例，点击复选框后，禁用取消复选框，但提供了下侧按钮销毁

![1722846459909](assets/1722846459909.png)

**视频回放示例**

这个示例，有进度条，可倍数播放

![1722846561637](assets/1722846561637.png)



路由在public下配置，主要是模拟接口QQ，动态路由渲染

![1722847576754](assets/1722847576754.png)


> 这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint

根据用户权限来动态生成侧边栏和 router

目前版本为 `v4.0+` 基于 `vue-cli` 进行构建


## Build Setup

```bash
# nvm install 16.18.0
#nvm use 16.18.0

# 克隆项目
git clone https://gitee.com/lhj20011106/m3u8_aliplayer_vue2_admin

# 进入项目目录
cd xxxx

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:8888](http://localhost:8888)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```


## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions


Copyright (c) 2023-present 
