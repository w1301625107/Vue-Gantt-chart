<template>
  <mark-line :markLineTime="currentTime"
             :getPositonOffset="getPositonOffset"
             color="rgba(255,0,0,.4)"></mark-line>
</template>

<script>
import moment from "moment";
import MarkLine from "./index.vue";
export default {
  name: "CurrentTime",
  components: { MarkLine },
  props: {
    getPositonOffset: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentTime: moment().toString()
    };
  },
  created() {
    const timeNow = setInterval(() => {
      this.currentTime = moment().toString();
    }, 1000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timeNow);
    });
  }
};
</script>
