<template>
  <div v-show="visible"
       class="gantt-markline"
       :style="{'background-color':color,'left':getBlockMargin()+'px'}">
    <div class="gantt-markline-content"
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
    getTimeLineMargin: {
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
    getBlockMargin() {
      if (this.markLineTime == null) {
        this.visible = false;
        return;
      } else {
        this.visible = true;
        return this.getTimeLineMargin(this.markLineTime);
      }
    }
  }
};
</script>