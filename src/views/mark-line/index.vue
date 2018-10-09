<template>
  <div v-show="visible"
       class="gantt-markline"
       :style="{'background-color':color,'margin-left':getBlockMargin()+'px'}"></div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "MarkLine",
  props: {
    baseMargin: {
      type: Number,
      default: 200
    },
    color: {
      type: String,
      default: "green"
    }
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapState(["cellWidth", "scale", "markLineTime"]),
    ...mapGetters(["startBlockTime"])
  },
  methods: {
    getBlockMargin() {
      if (this.markLineTime == null) {
        this.visible = false;
        return;
      } else {
        this.visible = true;
        let options = {
          cellWidth: this.cellWidth,
          scale: this.scale,
          startBlockTime: this.startBlockTime
        };
        let block = {
          start: this.markLineTime
        };
        return this.baseMargin + calcBlockMargin(block, options);
      }
    }
  }
};
</script>