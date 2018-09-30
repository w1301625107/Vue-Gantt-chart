<template>
  <div id="app">
    <header class="top-bar">Vue-Gantt-Chart</header>
    <gantt></gantt>
    <footer class="main-footer">wuchouchou</footer>
  </div>
</template>

<script>
import Gantt from '@views/gantt.vue'
export default {
  name: "App",
  components:{Gantt}
};
</script>