 
<template>
  <div class="name ">{{item.id}}.{{item.name}}</div>
</template>

<script>
export default {
  name: "TestLeft",
  props: {
    data:Object,
    item:Object
  }
};
</script>