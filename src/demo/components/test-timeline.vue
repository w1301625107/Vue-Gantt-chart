<template>
 <div class="test">
  <span v-for="i in getTimeScales(day)"> {{i.format('HH:mm')}}</span>
 </div> 
</template>

<script>
export default {
  name: "TestLeft",
  props: {
    day: Object,
    getTimeScales:Function,
  }
};
</script>

<style lang="scss" scoped>
.test{
  display: flex;

  span{
    flex:1
  }
}
</style>
