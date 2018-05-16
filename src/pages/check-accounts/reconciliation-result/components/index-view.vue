<template>
  <div id="app">
    <div class="icon-success"></div>
    <p class="success-title">授权成功</p>
    <p class="success-content"><span>3</span>条数据授权成功</p>
    <div class="success-button">
      <button class="again" @click="doAgain">继续授权</button>
      <button class="go-home">返回首页</button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import mixins from 'common/js/mixins';

  export default {
    name: 'checkResult',
    components: {
    },
    mixins,
    data() {
      return {

      }
    },
    methods: {
      doAgain() {
        AlipayJSBridge.call('popTo',{
          urlPattern: 'reconciliation.html',
        });
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';

  .icon-success {
    width: 110px;
    height: 110px;
    margin: 130px auto 0;
    background: url(../imgs/success.png) no-repeat;
    background-size: contain;
  }
  .success-title{
    margin-top: 28px;
    color: #3f8c1d;
    font-size: 36px;
    text-align: center;
  }
  .success-content{
    margin-top: 14px;
    color: #999;
    font-size: 30px;
    text-align: center;
    span{
      color: #3f8c1d;
    }
  }
  .success-button{
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
</style>
