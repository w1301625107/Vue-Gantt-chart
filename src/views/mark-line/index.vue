<template>
  <div v-show="visible"
       class="gantt-markline"
       :style="{'background-color':color,'left':getPosition()+'px'}">
    <div class="gantt-markline-label"
         :style="{'background-color':color}">{{markLineTime.format("HH:mm:ss")}}</div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "MarkLine",
  props: {
    markLineTime: {
      type: moment
    },
    color: {
      type: String,
      default: "green"
    },
    getTimeLinePosition: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    getPosition() {
      if (this.markLineTime == null) {
        this.visible = false;
        return 0;
      } else {
        this.visible = true;
        return this.getTimeLinePosition(this.markLineTime);
      }
    }
  }
};
</script>