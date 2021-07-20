<template>
  <div
    class="markline"
    :style="{  left: getPosition() + 'px' }"
  >
    <div class="markline-label">
      {{timeConfig.text}}{{ dayjs(timeConfig.time).format("HH:mm:ss") }}
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
export default {
  name: "TestMarkLine",
	props:['getPosition','timeConfig'],
	data(){
		return {
			dayjs
		}
	}
}
</script>

<style lang="scss" scoped>

.markline {
    position: absolute;
    z-index: 100;
    width: 2px;
    height: 100vh;
    background: #747e80;

    &-label {
      padding: 3px;
      width: 6rem;
      margin-left: -3rem;
      margin-top: 5rem;
      color: #fff;
      background: #747e80;
      text-align: center;
      border-radius: 5px;
      font-size: 0.7rem;
    }
}
</style>