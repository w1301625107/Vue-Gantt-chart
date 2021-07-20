<script>
import dayjs from "dayjs";
export default {
  name: "MarkLine",
  props: {
    timeConfig: {
      type: Object,
      required: true
    },
    getPositonOffset: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      dayjs: dayjs
    };
  },
  computed: {
    visible() {
      return this.timeConfig.time == null || this.timeConfig.time == undefined
        ? false
        : true;
    }
  },
  methods: {
    getPosition() {
      if (!this.visible) {
        return 0;
      } else {
        return this.getPositonOffset(this.timeConfig.time);
      }
    }
  },
  // eslint-disable-next-line
  render: function(h) {
    const { visible, getPosition, timeConfig } = this;
    if (!visible) {
      return null;
    }
    let vnode =
      this.$scopedSlots.default &&
      this.$scopedSlots.default({ timeConfig, getPosition });

    const px = getPosition();

    return !vnode ? (
      <div
        class="gantt-markline"
        style={{
          "background-color": timeConfig.color || "#0ca30a",
          left: px + "px"
        }}
      >
        <div
          class="gantt-markline-label"
          style={{ "background-color": timeConfig.color || "#0ca30a" }}
        >
          {dayjs(timeConfig.time).format("HH:mm:ss")}
        </div>
      </div>
    ) : (
      vnode
    );
  }
};
</script>
