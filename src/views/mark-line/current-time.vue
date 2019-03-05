<template>
  <mark-line :markLineTime="currentTime"
             :getTimeLineMargin="getTimeLineMargin"
             color="rgba(255,0,0,.4)"></mark-line>
</template>

<script>
import moment from "moment";
import MarkLine from "@views/mark-line/index.vue";
export default {
  name: "CurrentTime",
  components: { MarkLine },
  props: {
    getTimeLineMargin: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentTime: moment()
    };
  },
  created() {
    const timeNow = setInterval(() => {
      this.currentTime = moment();
    }, 1000);
    this.$once("hook:beforeDestroy", timeNow => {
      clearInterval(timeNow);
    });
  }
};
</script>
