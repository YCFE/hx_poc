<template>
  <div id="app">
    <template v-if="result === 'success'">
      <div class="icon-success"></div>
      <p class="success-title">审批成功</p>
      <p class="success-content"><span>3</span>条指令审批成功</p>
      <div class="result-button">
        <button class="again" @click="doAgain">继续审批</button>
        <button class="go-home" @click="goHome">返回首页</button>
      </div>
    </template>
    <template v-else>
      <div class="icon-fail"></div>
      <p class="fail-title">审批失败</p>
      <p class="fail-content"><span>3</span>条指令审批拒绝</p>
      <div class="result-button">
        <button class="again" @click="doAgain">继续审批</button>
        <button class="go-home" @click="goHome">返回首页</button>
      </div>
      <!-- <div class="fail-list">
        <div class="fail-item">
          <span class="label">指令类型</span>
          <span class="value">银企对账</span>
        </div>
        <div class="fail-item">
          <span class="label">失败原因</span>
          <span class="value">录入测试</span>
        </div>
        <div class="fail-item">
          <span class="label">指令类型</span>
          <span class="value">11020110446967</span>
        </div>
      </div> -->
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { getParam } from '@/libs/utils';
  import mixins from '@/libs/mixins';

  export default {
    name: 'accreditResult',
    data() {
      return {
        result: getParam('result')
      }
    },
    mixins: [mixins],
    methods: {
      doAgain() {
        AlipayJSBridge.call('popTo',{
          urlPattern: 'index.html',
        });
      },
      goHome() {
        AlipayJSBridge.call('exitSession');
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~@/assets/less/base.less';

  .icon-success, .icon-fail{
    width: 110px;
    height: 110px;
    margin: 130px auto 0;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .icon-success {
    background-image: url(./imgs/success.png);
  }
  .icon-fail {
    background-image: url(./imgs/fail.png);
  }
  .success-title,.fail-title{
    margin-top: 28px;
    font-size: 36px;
    text-align: center;
  }
  .success-title{
    color: #3f8c1d;
  }
  .fail-title{
    color: #da262f;
  }
  .success-content,.fail-content{
    margin-top: 14px;
    color: #999;
    font-size: 30px;
    text-align: center;
    span{
      color: #3f8c1d;
    }
  }
  .fail-content {
    span {
      color: #da262f;
    }
  }
  .result-button{
    display: block;
    margin-top: 120px;
    text-align: center;
    button{
      width: 320px;
      height: 100px;
      margin: 0 24px;
      border-radius: 10px;
      color: #fff;
      font-size: 36px;
    }
    .again {
      background-color: #e14636;
    }
    .go-home{
      background-color: #ea6a25;
    }
  }
  .fail-list{
    margin: 30px 28px;
    padding: 30px 0 0;
    border-top: 1px #ddd solid;
  }
  .fail-item{
    margin-bottom: 26px;
    .label{
      display: inline-block;
      width: 220px;
      color: #999;
      font-size: 30px;
    }
    .value{
      display: inline-block;
      width: 300px;
      color: #333;
      font-size: 30px;
    }
  }
</style>
