<template>
  <mark-line :markLineTime="currentTime"
             :getTimeLinePosition="getTimeLinePosition"
             color="rgba(255,0,0,.4)"></mark-line>
</template>

<script>
import moment from "moment";
import MarkLine from "./index.vue";
export default {
  name: "CurrentTime",
  components: { MarkLine },
  props: {
    getTimeLinePosition: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentTime: moment().format("YYYY-MM-DD HH:mm:ss")
    };
  },
  created() {
    const timeNow = setInterval(() => {
      this.currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
    this.$once("hook:beforeDestroy", timeNow => {
      clearInterval(timeNow);
    });
  }
};
</script>
