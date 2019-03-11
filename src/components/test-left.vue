 
<template>
  <div class="name" :style="{background:data.colorPair.light}">
    <div class="colorBar"  :style="{background:data.colorPair.dark}"/>
    <div class="type">{{data.type}}</div>
    <div class="carId">{{data.name}}{{data.id}}</div>
    <div class="speed">{{data.speed}}km/s</div>
  </div>
</template>

<script>
export default {
  name: "TestLeft",
  props: {
    data:Object,
  },
};
</script>

<style  scoped>
.name{
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  width: 100%;
  padding: 0 5px 0 0;
  border-radius: 8px 0 0 8px;
  align-items: center;

}
.colorBar{
  width: 10px;
  height: 100%;
}

.carId{
  flex: 1;
}

.type{
  padding: 0 5px 0 0 ;  
  font-size: 1.2rem;
}
</style>
