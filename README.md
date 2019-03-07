![](https://raw.githubusercontent.com/w1301625107/vue-gantt-chart/master/screenshot/icon.jpg)
# vue-gantt-chart
基于 Vue  实现的 gantt-like 图表 ,用于排班展示

预览Demo地址：https://w1301625107.github.io/Vue-Gantt-chart/dist/index

## 特性

- 只渲染可视区域
- 可变时间轴,1 天内可被整除的时间可变。1 分钟，2 分钟，3 分钟，4 分钟~~~到一天
- 可变时间轴宽高
- 标记线
- 支持自定义描述和容器块

## 运行截图

![](https://raw.githubusercontent.com/w1301625107/vue-gantt-chart/master/screenshot/page1.png)

## 安装 

``` bash
npm i v-gantt-chart --save
```

Include plugin in your `main.js` file.

```js
import Vue from 'vue'
import vGanttChart from 'v-gantt-chart';
Vue.use(vGanttChart});
```

## 使用

template code

```html
<template>
  <v-gantt-chart :startTime="startTime"
           :endTime="endTime"
           :cellWidth="cellWidth"
           :cellHeight="cellHeight"
           :titleHeight="titleHeight"
           :scale="scale"
           :titleWidth="titleWidth"
           :datas="datas">
      <template v-slot:block="{data,item}">
        <Test :data="data"
              :item="item"></Test>
      </template>
      <template v-slot:left="{data,item}">
        <TestLeft :item="item"></TestLeft>
      </template>
      <template v-slot:title>
        hola
      </template>
    </v-gantt-chart>
</template>
```

script code

```js
import Test from "./test.vue"; //你自己的gantt条容器
import TestLeft from "./test-left.vue"; //你自己的行名称组件
import { mockDatas } from "@src/mock/index.js"; //伪造的数据
import moment from "moment" //时间库
export default {
  name: "App",
  components: { Test, TestLeft },
  data() {
    return {
      startTime: moment().toString(),//时间轴开始时间
      endTime: moment() 
        .add(2, "d")
        .add(2, "h")
        .add(5, "s").toString(), //时间结束时间
      cellWidth: 50,    //时间区间的宽度
      cellHeight: 20,  //时间区间的高度
      titleHeight: 40,  //表头的宽度
      titleWidth: 200, //行和表头的宽度
      scale: 60, //时间刻度
      datas: mockDatas(100), // gantt数据
    };
  },
};

//渲染的数据，有特殊格式 ，目前要求数组中每一个值均为对象，且有gtAarry对象数组这个属性，gtArray中每一个对象需有两个属性，start和end，需为合法的时间字符串.例如
[
  {
    id:'test', //非必须
    gtArray:[
      {
        name:'test', //非必须
        start:'2019-01-11 18:18:18',
        end:'2019-01-11 18:18:18'
      }
    ]
  }
]
//其他不做限制。

```

## 参数列表

| 参数            | 是否必须 | 值类型  | 默认值 | 描述                                                                                                                                                                                                                                                           |
| :-------------- | :------- | :------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| startTime       | true     | string  | --     | 时间轴开始时间,需为合法的时间字符串，如：‘2019-01-11 18:18:18’                                                                                                                                                                                               |
| endTime         | true     | string  | --     | 时间轴结束时间,需为合法的时间字符串，如：‘2019-01-11 18:18:18’                                                                                                                                                                                               |
| cellWidth       | false    | number  | 50     | 时间区间的宽度                                                                                                                                                                                                                                                 |
| cellHeight      | false    | number  | 20     | 时间区间的高度                                                                                                                                                                                                                                                 |
| titleHeight     | false    | number  | 40     | 表头的高度                                                                                                                                                                                                                                                     |
| titleWidth      | false    | number  | 200    | 表头和行的宽度                                                                                                                                                                                                                                                 |
| scale           | false    | number  | 60     | 时间轴的刻度值。单位:分钟，允许值[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 120，180,240,360, 720, 1440]                                                                                                                                                       |
| datas           | true     | array   | --     | 渲染的数据，有特殊格式 ，目前要求数组中每一个值均为对象，且有gtAarry对象数组这个属性，gtArray中每一个对象需有两个属性，start和end，需为合法的时间字符串.例如```[{id:'test',gtArray:[{start:'2019-01-11 18:18:18',end:'2019-01-11 18:18:18'}]}] ``` 其他不做限制。 |
| dataKey         | false    | string  | --     | 渲染的每一行的key                                                                                                                                                                                                                                              |
| itemKey         | false    | string  | --     | 渲染的每一个gantt容器的key                                                                                                                                                                                                                                     |
| showCurrentTime | false    | boolean | false  | 显示当前时间,每秒钟更新                                                                                                                                                                                                                                        |
| timelines       | false    | array   | --     | 显示标记时间，有特殊格式 ``` [{time:'2019-01-11 18:18:18',color:'#00000'}]```                                                                                                                                                                                  |


## 下一步计划
- 加快渲染速度



## 运行 Demo

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