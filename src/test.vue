<template>
  <div class="plan">{{data.name}}{{item.start.format("HH:mm:ss")}}</div>
</template>

<script>
export default {
  name: "Test",
  props: {
    data:Object,
    item:Object
  }
};
</script>

<style>
</style>
