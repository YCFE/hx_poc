<template>
  <div id="app">
    <h3 class="confirm-title">请确认以下信息</h3>
    <div class="confirm-header">
      <p class="header-title">转账金额</p>
      <div class="clearfix header-money">
        <span class="fl">&yen;500</span>
        <span class="fr">手续费：&yen;5</span>
      </div>
    </div>
    <div class="confirm-wrap">
      <div class="confirm-list">
        <p class="item-title">对方账户</p>
        <div class="confirm-item">
          <span class="label">收款人</span>
          <span class="value">大白</span>
        </div>
        <div class="confirm-item">
          <span class="label">收款账号</span>
          <span class="value">110 2011 0446 967 </span>
        </div>
        <div class="confirm-item">
          <span class="label">收款银行</span>
          <span class="value">华夏银行</span>
        </div>
      </div>
      <div class="confirm-list">
        <p class="item-title">交易信息</p>
        <div class="confirm-item">
          <span class="label">付款账号</span>
          <span class="value">110 2011 0446 967</span>
        </div>
        <div class="confirm-item">
          <span class="label">付款用途</span>
          <span class="value">转账汇款 </span>
        </div>
        <div class="confirm-item">
          <span class="label">大写金额</span>
          <span class="value">五百元整</span>
        </div>
      </div>
    </div>
    <div class="auth-title">请完成以下认证</div>
    <div class="auth-code">
      <div class="code-title clearfix">
        <span class="fl">认证方式</span>
        <span class="fr">短信认证</span>
      </div>
      <div class="transaction-item bor-bottom">
        <label for="">验证码</label>
        <input type="text" placeholder="请输入验证码">
        <!-- <button class="btn btn-code">重新获取</button> -->
        <countdownClick
            :second="60"
            @click.native="runTimer"
            ref="timer"></countdownClick>
      </div>
    </div>
    <div class="submit-button">
      <button class="btn btn-primary" @click="doSubmit">确认转账</button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { MessageBox } from 'mint-ui';
  import request from 'common/js/request';
  import countdownClick from 'common/components/countdownClick';

  export default {
    name: 'transferAppointmentTransferConfirm',
    components: {
      countdownClick
    },
    data() {
      return {
        code: ''
      }
    },
    methods: {
      runTimer(argu) {
        this.$refs.timer.run();
        /* if (argu === 'again') {
          request('client.accredit.getCode', r => {
            this.$refs.timer.run();
          });
        } else {
          this.$refs.timer.run();
        } */
      },
      doSubmit() {
        if(!this.code) {
          MessageBox('提示', '请输入验证码');
          return;
        }
        if(this.code.length < 6) {
          MessageBox('提示', '请输入6位验证码');
          return;
        }

        AlipayJSBridge.call('pushWindow',{
          url: 'result.html',
        });
      }
    },
    mounted() {
      setTimeout(() => {
        this.runTimer();
      }, 1000);
    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';

  .confirm-title,.auth-title{
    color: #333;
    font-size: 30px;
    background-color: #efeff4;
    padding: 20px 30px;
    font-weight: normal;
  }
  .confirm-header{
    background-color: #e14636;
    padding: 30px 30px 56px;
    color: #fff;
    .header-title{
      font-size: 30px;
    }
    .header-money{
      margin-top: 30px;
      .fl{
        font-size: 50px;
      }
      .fr{
        margin-top: 12px;
        font-size: 30px;
      }
    }
  }
  .confirm-wrap{
    margin: 0 30px;
    .confirm-list{
      padding: 38px 0 18px;
      &:first-child {
        border-bottom: 1px #ddd solid;
      }
    }
    .confirm-item{
      margin-bottom: 20px;
    }
    .item-title{
      margin-bottom: 30px;
      color: #333;
      font-size: 30px;
    }
    .label{
      display: inline-block;
      width: 180px;
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
  .code-title {
    padding: 34px 30px;
    color: #333;
    font-size: 30px;
    background-color: #fff;
    border-bottom: 1px #ddd solid;
  }
  .code-send{
    position: relative;
    height: 132px;
    line-height: 132px;
    padding: 0 30px;
    color: #333;
    font-size: 30px;
    background-color: #fff;
    border-bottom: 1px #ddd solid;
  }
  .btn-code{
    font-size: 26px;
    padding: 20px 0;
    float: right;
    margin-bottom: 60px;
  }
  .code-input{
    margin-left: 80px;
  }
  .submit-button{
    margin: 40px 30px 60px;
  }
</style>
