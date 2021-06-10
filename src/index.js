import gantt from "./gantt.vue";

gantt.version = "__VERSION__";
gantt.install = function(Vue) {
  //     // 将其注册为vue的组件，'gantt'是组件名
  Vue.component("v-gantt-chart", gantt);
};
// 新增
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(gantt);
}

// 最后将插件导出，并在main.js中通过Vue.use()即可使用插件
export default gantt;
// export const vGanttChart = gantt;
