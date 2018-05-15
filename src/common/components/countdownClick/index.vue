<template>
  <button class="btn btn-code" :disabled="isDisabled">{{text}}</button>
</template>

<script>
export default{
  name:'countdownClick',
  data() {
    return{
      text: '获取',
      isDisabled: false
    }
  },
  props: {
    second: {
      type: Number,
      default: 60
    }
  },
  computed: {
  },
  methods:{
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
      } else{
        this.text = '重新获取';
        this.isDisabled = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
