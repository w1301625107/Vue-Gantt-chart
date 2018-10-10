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
             v-model.number.lazy="cellWidth">
      <label for="cellHeight">cellHeight</label>
      <input id="cellHeight"
             v-model.number.lazy="cellHeight">
      <label for="scale">scale</label>
      <select id="scale"
              v-model.number="scale">
        <option v-for="i in scaleList"
                :key="i">{{i}}</option>
      </select>
      <span>minute</span>
    </header>
    <gantt></gantt>
    <footer class="main-footer">wuchouchou</footer>
  </div>
</template>

<script>
import Gantt from "@views/gantt.vue";
import {
  updateShowTimeBlock,
  updateShowProject,
  updateShowPlan,
  updateShowActual,
  updateCellWidth,
  updateCellHeight,
  updateScale
} from "@src/store/mutation-type.js";
export default {
  name: "App",
  components: { Gantt },
  computed: {
    scaleList() {
      return this.$store.state.scaleList;
    },
    showTimeBlock: {
      get() {
        return this.$store.state.showTimeBlock;
      },
      set(value) {
        this.$store.commit(updateShowTimeBlock, value);
      }
    },
    showProject: {
      get() {
        return this.$store.state.showProject;
      },
      set(value) {
        this.$store.commit(updateShowProject, value);
      }
    },
    showPlan: {
      get() {
        return this.$store.state.showPlan;
      },
      set(value) {
        this.$store.commit(updateShowPlan, value);
      }
    },
    showActual: {
      get() {
        return this.$store.state.showActual;
      },
      set(value) {
        this.$store.commit(updateShowActual, value);
      }
    },
    cellWidth: {
      get() {
        return this.$store.state.cellWidth;
      },
      set(value) {
        this.$store.commit(updateCellWidth, value);
      }
    },
    cellHeight: {
      get() {
        return this.$store.state.cellHeight;
      },
      set(value) {
        this.$store.commit(updateCellHeight, value);
      }
    },
    scale: {
      get() {
        return this.$store.state.scale;
      },
      set(value) {
        this.$store.commit(updateScale, value);
      }
    }
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
