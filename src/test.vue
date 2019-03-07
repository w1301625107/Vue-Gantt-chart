<template>
  <div class="plan"
       :style="{'background-color':statusColor}">
    <div class="runTime">
      <span>起{{moment(item.start).format("HH:mm:ss")}}</span>
      <span>至{{moment(item.end).format("HH:mm:ss")}}</span>
    </div>
    <div class="middle">编号{{item.id}}</div>
    <div class="passenger">{{item.passenger}}人</div>

  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Test",
  props: {
    data: Object,
    item: Object,
    currentTime: moment
  },
  data() {
    return {
      moment: moment
    };
  },
  computed: {
    statusColor() {
      let { item, currentTime } = this;
      let start = moment(item.start);
      let end = moment(item.end);
      if (start.isBefore(currentTime) && end.isAfter(currentTime)) {
        return "#65b2a7";
      } else if (end.isBefore(currentTime)) {
        return "#9e9e9e";
      } else {
        return "#69b3e1";
      }
    }
  }
};
</script>

<style scoped>
.middle{
  flex:1;
  padding-left: 5px;
}
.runTime {
  display: flex;
  flex-direction: column;
}
.plan {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  color: #fff;
  padding-left: 5px;
  font-size: 0.8rem;
  opacity: .8;
}
</style>
