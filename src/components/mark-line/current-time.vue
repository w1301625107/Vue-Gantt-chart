<template>
  <mark-line
    :timeConfig="{ time: currentTime, color: 'rgba(255,0,0,.4)' }"
    :getPositionOffset="getPositionOffset"
  ></mark-line>
</template>

<script>
import dayjs from "dayjs";
import MarkLine from "./index.vue";
export default {
  name: "CurrentTime",
  components: { MarkLine },
  props: {
    getPositionOffset: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      currentTime: dayjs().toString()
    };
  },
  created() {
    const timeNow = setInterval(() => {
      this.currentTime = dayjs().toString();
    }, 1000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timeNow);
    });
  }
};
</script>
