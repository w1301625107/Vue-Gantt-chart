<template>
  <div id="app">
    <header class="top-bar">Vue-Gantt-Chart
      <label for="showTimeBlock">showTimeBlock</label>
      <input id="showTimeBlock"
             v-model="showTimeBlock"
             type="checkbox">
      <label for="showProject">showProject</label>
      <input id="showProject"
             v-model="showProject"
             type="checkbox">
      <label for="showPlan">showPlan</label>
      <input id="showPlan"
             v-model="showPlan"
             type="checkbox">
      <label for="showActual">showActual</label>
      <input id="showActual"
             v-model="showActual"
             type="checkbox">
      <label for="cellWidth">cellWidth</label>
      <input id="cellWidth"
             v-model.number="cellWidth">
      <label for="cellHeight">cellHeight</label>
      <input id="cellHeight"
             v-model.number="cellHeight">
      <label for="scale">scale</label>
      <select id="scale"
              v-model="scale">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>10</option>
        <option>12</option>
        <option>15</option>
        <option>20</option>
        <option>30</option>
        <option>60</option>
      </select>
      <span>m</span>
    </header>
    <gantt></gantt>
    <footer class="main-footer">wuchouchou</footer>
  </div>
</template>

<script>
import Gantt from "@views/gantt.vue";
export default {
  name: "App",
  components: { Gantt },
  computed: {
    showTimeBlock: {
      get() {
        return this.$store.state.showTimeBlock;
      },
      set(value) {
        this.$store.commit("updateShowTimeBlock", value);
      }
    },
    showProject: {
      get() {
        return this.$store.state.showProject;
      },
      set(value) {
        this.$store.commit("updateShowProject", value);
      }
    },
    showPlan: {
      get() {
        return this.$store.state.showPlan;
      },
      set(value) {
        this.$store.commit("updateShowPlan", value);
      }
    },
    showActual: {
      get() {
        return this.$store.state.showActual;
      },
      set(value) {
        this.$store.commit("updateShowActual", value);
      }
    },
    cellWidth: {
      get() {
        return this.$store.state.cellWidth;
      },
      set(value) {
        this.$store.commit("updateCellWidth", value);
      }
    },
    cellHeight: {
      get() {
        return this.$store.state.cellHeight;
      },
      set(value) {
        this.$store.commit("updateCellHeight", value);
      }
    },
    scale: {
      get() {
        return this.$store.state.scale;
      },
      set(value) {
        this.$store.commit("updateScale", value);
      }
    }
  },
  created() {
    console.log(this.$store.state.showTimeBlock);
  }
};
</script>
<style scoped>
label {
  margin-left: 10px;
}
input {
  width: 40px;
  height: 20px;
  vertical-align: bottom;
}
</style>
