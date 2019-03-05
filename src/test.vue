<template>
  <div class="plan">{{data.name}}{{moment(item.start).format("HH:mm:ss")}}</div>
</template>

<script>
import moment from 'moment'
export default {
  name: "Test",
  props: {
    data:Object,
    item:Object
  },
  data(){
    return{
      moment:moment
    }
  }
};
</script>