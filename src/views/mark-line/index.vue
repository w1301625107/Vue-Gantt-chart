<template>
  <div v-show="visible"
       class="gantt-markline"
       :style="{'background-color':color,'margin-left':getBlockMargin()+'px'}"></div>
</template>

<script>
import { calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "MarkLine",
  props: {
    time: {
      type: Object,
      default: null
    },
    baseMargin: {
      type: Number,
      default: 200
    },
    color: {
      type: String,
      default: "green"
    },
    cellWidth: {
      type: Number,
      default: 20
    },
    scale: {
      type: Number,
      default: 1
    },
    startBlockTime: {
      required: true
    }
  },
  data() {
    return {
      visible: false,
      options: {
        cellWidth: this.cellWidth,
        scale: this.scale,
        startBlockTime: this.startBlockTime
      }
    };
  },
  methods: {
    getBlockMargin() {
      if (this.time == null) {
        this.visible = false;
        return;
      } else {
        this.visible = true;
        let block = {
          start: this.time
        };
        return this.baseMargin + calcBlockMargin(block, this.options);
      }
    }
  }
};
</script>


