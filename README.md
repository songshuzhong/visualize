# visualize

## 项目简介
visualize可视化布局系统封装了丰富的Bootstrap3UI控件和ECharts图表集。
开发者在该系统下可直接通过鼠标拖拽的方式构建web页面，也可以进入编辑区对代码进行编辑以实现页面的自定义展示。

## 项目结构如下
> a jQuery + bootstrap project
``````````````````````````````````````
├─config
├─node_modules
├─server
│  ├─db
│  ├─router
│  ├─service
│  └─utils
├─static
│  ├─bower_components
│  ├─cs
│  ├─img
│  └─js
└─views
``````````````````````````````````````


## 启动手册

``` bash
# install dependencies
npm install
bower install

# serve with hot reload at localhost:8080
nodemon --debug --inspect ./server/app.js

# build for production with minification
node ./server/app.js
```

## 更新日志
````````````````````````````````````````````````````````````````
 Version v0.0.1
 User songshuzhong@bonc.com.cn
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年8月9日 songshuzhong    v0.0.1            修复组件通信
 ````````````````````````````````````````````````````````````````
````````````````````````````````````````````````````````````````
 Version v0.0.2
 User songshuzhong@bonc.com.cn
 ------------------------------------------------------------
 Date         Author          Version            Description
 ------------------------------------------------------------
 2018年9月3日 songshuzhong    v0.0.2            重构代码结构、页面布局、代码提示、组件异常捕获
 ````````````````````````````````````````````````````````````````
 ````````````````````````````````````````````````````````````````
  Version v0.0.3
  User songshuzhong@bonc.com.cn
  ------------------------------------------------------------
  Date         Author          Version            Description
  ------------------------------------------------------------
  2018年9月7日 songshuzhong    v0.0.3            丰富bootstrap组件库，并对form控件添加自动校验
  ````````````````````````````````````````````````````````````````