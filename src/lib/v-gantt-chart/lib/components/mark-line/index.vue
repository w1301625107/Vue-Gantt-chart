<template>
  <div v-show="visible"
       class="gantt-markline"
       :style="{'background-color':color,'left':getPosition()+'px'}">
    <div class="gantt-markline-label"
         :style="{'background-color':color}">{{dayjs(markLineTime).format("HH:mm:ss")}}</div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "MarkLine",
  props: {
    markLineTime: {
      validator(date) {
        return dayjs(date).isValid();
      }
    },
    color: {
      type: String,
      default: "#0ca30a"
    },
    getPositonOffset: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      dayjs:dayjs
    };
  },
  methods: {
    getPosition() {
      if (this.markLineTime == null) {
        this.visible = false;
        return 0;
      } else {
        this.visible = true;
        return this.getPositonOffset(this.markLineTime);
      }
    }
  }
};
</script>