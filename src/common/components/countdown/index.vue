<template>
  <div>
    <button class="btn btn-code code-button-position" :disabled="isDisabled" :class="{'code-disabled': isDisabled}">{{text}}</button>
  </div>
</template>

<script>
export default{
  name: 'countdown',
  data() {
    return {
      text: '等待发送',
      isDisabled: false
    };
  },
  props: {
    second: {
      type: Number,
      default: 60
    }
  },
  computed: {
  },
  methods: {
    run() {
      this.time = this.second;
      this.timer();
    },
    timer() {
      if (this.time > 0) {
        this.time--;
        this.text = `${this.time}s`;
        this.timeoutId = setTimeout(this.timer, 1000);
        this.isDisabled = true;
      } else {
        clearInterval(this.timeoutId);
        this.text = '重新获取';
        this.isDisabled = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.code-disabled{
  background-color: #bbb;
}
</style>
