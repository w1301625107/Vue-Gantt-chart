<script>
import dayjs from "dayjs";
export default {
  name: "MarkLine",
  props: {
    markLineTime: {
      validator(date) {
        return dayjs(date).isValid();
      }
    },
    color: {
      type: String,
      default: "#0ca30a"
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
      return this.markLineTime == null ? false : true;
    }
  },
  methods: {
    getPosition() {
      if (this.markLineTime == null) {
        return 0;
      } else {
        return this.getPositonOffset(this.markLineTime);
      }
    }
  },
  // eslint-disable-next-line
  render: function(h) {
    const { visible, getPosition, color, markLineTime } = this;
    if (!visible) {
      return null;
    }
    let vnode =
      this.$scopedSlots.default &&
      this.$scopedSlots.default({ markLineTime, getPosition });

    const px = getPosition();

    return !vnode ? (
      <div
        class="gantt-markline"
        style={{ "background-color": color, left: px + "px" }}
      >
        <div class="gantt-markline-label" style={{ "background-color": color }}>
          {dayjs(markLineTime).format("HH:mm:ss")}
        </div>
      </div>
    ) : (
      vnode
    );
  }
};
</script>
