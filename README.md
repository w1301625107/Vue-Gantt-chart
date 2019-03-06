# vue-gantt-chart(重构中ing)
基于 Vue ~~+Vuex~~ 实现的 gantt-like 图表 ,用于排班展示

~~引入 jqeryui 来实现容器块拉伸，移动~~

# 特性

- 可变时间轴,1 天内可被整除的时间可变。1 分钟，2 分钟，3 分钟，4 分钟~~~到一天
- 可变时间轴宽高
- ~~可选显示计划~~
- 标记线
- 支持自定义描述和容器块

# 下一步计划
- 编写使用说明
- 横轴根据时间范围动态渲染，加快渲染速度
- ~~通用计划条~~
- 自定义标记线 
- 高亮？整块，还是线提示？
- 背景表格线定制？
- 将项目变成一个组件(完成部分，打算上npm?)

# 截图(现在分支取消了部分东西)
## 原版位置 https://github.com/w1301625107/Vue-Gantt-chart/commit/09995a8e1ab13badcae6d8a9d21171cade8d89a1

![](https://raw.githubusercontent.com/w1301625107/vue-gantt-chart/master/screenshot/page1.png)

## 运行

### 注意项目需要 node 环境

```bash
#进入项目根目录
#安装
npm i
# 启动
npm run dev
#打开浏览器地址栏输入localhost:8080即可
```

## 注意兼容性？
IE 需要注意一下