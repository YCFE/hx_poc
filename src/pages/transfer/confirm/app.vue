<template>
  <div id="app">
    <div class="confirm-header">
      <p class="header-title">转账金额</p>
      <div class="clearfix header-money">
        <span class="fl">&yen;{{params.transforValue}}</span>
        <span class="fr">手续费：{{options.fee}}</span>
      </div>
    </div>
    <h3 class="confirm-title">请确认以下信息</h3>
    <div class="confirm-wrap">
      <div class="confirm-list">
        <p class="item-title">对方账户</p>
        <div class="confirm-item">
          <span class="label">收款人</span>
          <span class="value">{{params.receiveName}}</span>
        </div>
        <div class="confirm-item">
          <span class="label">收款账号</span>
          <span class="value">{{params.receiveNum}}</span>
        </div>
        <div class="confirm-item">
          <span class="label">收款银行</span>
          <span class="value">{{params.receiveBank}}</span>
        </div>
      </div>
      <div class="confirm-list">
        <p class="item-title">交易信息</p>
        <div class="confirm-item">
          <span class="label">付款账号</span>
          <span class="value">{{params.payNum}}</span>
        </div>
        <div class="confirm-item">
          <span class="label">付款用途</span>
          <span class="value">{{params.use}} </span>
        </div>
        <div class="confirm-item">
          <span class="label">大写金额</span>
          <span class="value">{{options.money || digitUppercase}}</span>
        </div>
      </div>
    </div>
    <div class="auth-title">请完成以下认证</div>
    <div class="auth-code">
      <div class="code-title clearfix">
        <span class="fl">认证方式</span>
        <span class="fr" v-if="!isBig">短信认证</span>
        <span class="fr" v-else>动态挑战码</span>
      </div>
      <div class="transaction-item bor-bottom" v-if="!isBig">
        <label for="">验证码</label>
        <input type="tel" placeholder="请输入验证码" v-inputScrollView maxlength="6" v-model="code">
        <countdownClick
            :second="60"
            @click.native="runTimer"
            ref="timer"></countdownClick>
      </div>
      <div class="transaction-item bor-bottom" v-else>
        <label for="">动态挑战码</label>
        <input type="tel" placeholder="请输入动态挑战码" v-inputScrollView v-model="code">
      </div>
    </div>
    <div class="submit-button">
      <button class="btn btn-primary" @click="doSubmit">确认转账</button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import request from '@/libs/request';
  import countdownClick from '@/components/countdownClick';
  import mixins from '@/libs/mixins';
  import { getParam } from '@/libs/utils';
  import directives from '@/libs/directives';
  import digitUppercase from '@/libs/modules/digit-uppercase';

  export default {
    name: 'transferConfirm',
    components: {
      countdownClick
    },
    mixins: [mixins],
    directives,
    filters: {
      digitUppercase
    },
    data() {
      return {
        code: '',
        isBig: false,
        options: null,
        params: JSON.parse(getParam('r')),
        seedId: 'transferConfirm'
      }
    },
    methods: {
      runTimer() {
        this.$refs.timer.run();
      },
      doSubmit() {
        if(!this.code) {
          this.alert('请输入验证码');
          return;
        }
        if(this.code.length < 6 && !this.isBig) {
          this.alert('请输入6位验证码');
          return;
        }

        AlipayJSBridge.call('remoteLog',{
          seedId: 'transferValue',
          param: `transfer_money=${parseFloat(this.params.transforValue.replace(/,/g, ''))}`
        });

        request('client.transfer.confirm', r => {
          AlipayJSBridge.call('pushWindow',{
            url: 'result.html',
          });
        });
      },
      getData(){
        request('client.transfer.getTransferConirmData', r => {
          this.options = r.data;
        });
      }
    },
    mounted() {
      this.isBig = parseInt(this.params.transforValue.replace(/,/, '')) > 50000;
      this.getData();
    }
  }

</script>

<style lang="less">
  @import '~@/assets/less/base.less';

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
      width: 400px;
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
    float: right;
    line-height: 2.6;
    //margin-bottom: 60px;
    width: 142px;
    margin-top: -15px;
  }
  .code-input{
    margin-left: 80px;
  }
  .submit-button{
    margin: 40px 30px 80px;
  }
  .transaction-item{
    padding: 40px;
    font-size: 30px;
    label{
      width: 170px;
      display: inline-block;
    }
    input{
      width: 230px;
    }
  }
  .bor-bottom{
    border-bottom: 1px #ddd solid;
  }
</style>
