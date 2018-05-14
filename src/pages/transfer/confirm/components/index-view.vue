<template>
  <div id="app">
    <div class="tip">
      请确认一下信息
    </div>
    <div class="fee-detail">
      <p>转账金额</p>
      <p class="number-p"><span class="number">¥500.00</span> <span class="pull-right">手续费：3.00</span></p>
    </div>
    <div class="transaction">
      <div class="transaction-item">
        <p class="title">对方账户</p>
        <p><span>收款人</span> 白白</p>
        <p><span>收款账号</span> 110 2120 1233 1000</p>
        <p><span>收款银行</span> 华夏银行</p>
      </div>
      <div class="transaction-item">
        <p class="title">交易信息</p>
        <p><span>付款账号</span> 110 2120 1233 1000</p>
        <p><span>付款用途</span> 转账汇款</p>
        <p><span>大写金额</span> 五百元整</p>
      </div>
    </div>
    <div class="tip">
      请完成以下认证
    </div>
    <div class="transaction">
      <div class="transaction-item">
        <p>对方账户 <span class="pull-right font-gray">短信认证方式</span></p>
      </div>
      <div class="transaction-item bor-bottom">
        <label for="">验证码</label>
        <input type="text" placeholder="请输入验证码">
        <!-- <button class="btn btn-code">重新获取</button> -->
        <!-- <countdown
            :second="60"
            @click.native="runTimer('again')"
            ref="timer"></countdown> -->
      </div>
      <button class="btn">确认转账</button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import request from 'common/js/request';
  import countdown from 'common/components/countdown';

  export default {
    name: 'transferConfirm',
    components: {
      countdown
    },
    data() {
      return {

      }
    },
    method:{
      runTimer(argu) {
        if (argu === 'again') {
          request('client.accredit.getCode', r => {
            this.$refs.timer.run();
          });
        } else {
          this.$refs.timer.run();
        }
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';
  .pull-right{
    float: right;
  }
  .pull-left{
    float: left;
  }
  .clearfix{
    display: block;
    clear:both;
  }
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .tip{
    background: #efeff4;
    padding: 28px 40px 20px;
    font-size: 30px;
    color: #333;
  }
  .fee-detail{
    background: #e14636;
    color: #fff;
    font-size: 30px;
    padding: 35px 40px 5px;
  }
  .number-p{
    line-height: 100px;
  }
  .number{
    font-size: 50px;
  }
  .transaction{
    padding: 0 40px;
    .title{
      margin-bottom: 10px;
    }
    .transaction-item{
      border-bottom: 1px solid #ddd;
      padding: 40px 0;
      color: #333;
      line-height: 50px;
      label{
        width: 165px;
        display: inline-block;
      }
      span{
        width: 175px;
        display: inline-block;
        color: #999;
      }
    }
    .transaction-item:last-child{
      border-bottom: none;
    }
  }
  .btn-code{
    display: inline-block;
    width: 140px;
    height: 60px;
    font-size: 26px;
    padding: 20px 0;
    float: right;
    margin-bottom: 60px;
    margin-top: -60px;
  }
  .bor-bottom{
    border-bottom: 1px solid #ddd;
  }
  .font-gray{
    color: #333 !important;
  }
</style>
