<template>
  <mt-popup class="mint-select" v-model="popupVisible" position="bottom">
    <div class="mint-select-header clearfix">
      <button class="cancel fl" @click="close">取消</button>
      <button class="confirm fr" @click="doConfirm">确定</button>
    </div>
    <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
  </mt-popup>
</template>

<script>
export default {
  data() {
    return {
      popupVisible: false,
      values: ''
    };
  },
  props: {
    slots: Array,
    onChange: Function
  },
  methods: {
    onValuesChange(picker, values) {
      this.values = values;
    },
    doConfirm() {
      this.onChange && this.onChange(this.values);
      this.close();
    },
    open() {
      this.popupVisible = true;
    },
    close() {
      this.popupVisible = false;
    }
  }
};
</script>

<style>
.mint-select {
  width: 100%;
}
</style>

<style lang="less" scoped>
.mint-select-header {
  padding: 12px 0;
  border: 1px #eee solid;
  button {
    width: 50%;
    font-size: 16px;
    color: #26a2ff;
    text-align: center;
    background-color: transparent;
  }
}
</style>
