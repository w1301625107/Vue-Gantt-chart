 
<template>
  <div class="name ">{{data.id}}.{{data.name}}</div>
</template>

<script>
export default {
  name: "TestLeft",
  props: {
    data:Object,
  }
};
</script>