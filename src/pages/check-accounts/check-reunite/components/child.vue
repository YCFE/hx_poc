<template>
  <div>
    <header class="telephone-information">
      <span class="text-distance">已向尾号<span>4444</span>的绑定手机号发送验证码，请查收</span>
    </header>
    <div class="list-wrap" v-if="options">
      <section>
        <ul style="position: relative" class="border-set" v-for="(item, index) in options" :key="index">
          <li class="li-dis  special">
            <span class="text-color title-special">账号</span>
            <span>{{item.accountNumber}}</span>
          </li>
          <li class="position-set">
            <span class="text-color">币种</span><span class="currency-distance">{{item.currency}}</span>
          </li>
          <li class="li-dis">
            <span class="text-color title">账号名称</span>
            <span>{{item.accountName}}</span>
          </li>
          <li class="li-dis">
            <span class="text-color title">对账结果</span>
            <span>{{state[index]}}</span>
          </li>
          <!-- <li class="li-dis-special">
            <span class="text-color title">复核结果</span>
            <span>{{item.result}}</span>
          </li> -->
        </ul>
      </section>
      <footer class="footer-dis">
        <div class="text-dis text-color  record-distance">
          共{{totalNumber}}条记录， 显示{{fromNumber}}至{{toNumber}}条记录
        </div>
        <div class="page-count clearfix">
          <span class="fl">
            <a href="javascript:;" @click="getLists">上一页</a>/<a href="javascript:;" @click="getLists">第一页</a>
          </span>
          <span class="fr">
            <a href="javascript:;" @click="getLists">下一页</a>/<a href="javascript:;" @click="getLists">最后一页</a>
          </span>
        </div>
        <div class="code-distance" style="position: relative">
          <span>验证码</span>
          <input class="input-distance" maxlength="6" type="tel" placeholder="请输入验证码" v-model="code"/>
          <countdown
            :second="60"
            @click.native="runTimer('again')"
            ref="timer"></countdown>
        </div>
        <div class="footer-button">
          <button class="button-size button-dis btn" @click="nextStep">下一步</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  import request from 'common/js/request';
  import utils from 'common/js/utils';
  import countdown from 'common/components/countdown';
  import { MessageBox } from 'mint-ui';

  const { getParam } = utils;

  export default {
    name: 'child',
    components: {
      countdown
    },
    data() {
      return {
        name: 'child',
        code: '',
        totalNumber: '',
        fromNumber: 1,
        toNumber: 3,
        options: null,
        state: getParam('r').split(',')
      };
    },
    mounted() {
      setTimeout(() => {
        this.runTimer();
      }, 1000);
      this.getLists();
    },
    methods: {
      runTimer(argu) {
        if (argu === 'again') {
          request('client.accredit.getCode', r => {
            this.$refs.timer.run();
          });
        } else {
          this.$refs.timer.run();
        }
      },
      getLists() {
        request('client.checkaccounts.getCheckReunite', r => {
          this.options = r.data;
          this.totalNumber = r.data.length;
        });
      },
      nextStep() {
        if(!this.code){
          MessageBox('提示', '请输入验证码');
          return;
        }
        if(!/^\d{6}$/.test(this.code)) {
          MessageBox('提示', '请输入6位数字验证码');
          return;
        }
        AlipayJSBridge.call('pushWindow', {
          url: 'result.html'
        });
      }
    }
  }

</script>

<style lang="less">
  .telephone-information{
    padding-left: 30px;
    background-color:#EFEFF4;
    height: 64px;
    line-height: 64px;
    color:#E14636;
    font-size: 23px;
  }
  .footer-dis{
    margin-top: 32px;
  }
  .footer-button{
    text-align: center;
  }
  .button-size{
    height: 100px;
    background-color: #E14535;
    border-radius: 10px;
  }
  .page{
    margin:57px 0px 29px 15px
  }
  .next-page{
    margin-left: 220px;
  }
  .page-count {
    color: #a1a1a1;
    font-size: 28px;
    margin: 50px 0 0;
    a {
      color: #a1a1a1;
      font-size: 28px;
    }
  }
  .btn-code{
    font-size: 25px;
    height: 64px;
    width: 170px;
  }
  .code-distance{
    margin-top: 58px;
    padding-bottom: 25px;
    border-bottom: 1px solid #DDDDDD;
    margin-bottom: 66px;
  }
  .code-button-position{
    position: absolute;
    bottom:12px;
    right:0px;
  }
  .password{
    padding-bottom: 25px;
    border-bottom: 1px solid #DDDDDD;
    margin-bottom: 140px;
  }
  .button-size{
    height: 100px;
    background-color: #E14535;
    border-radius: 10px;
  }
  .input-distance{
    margin-left: 112px;
  }
  .input-password-distance{
    margin-left: 82px;
  }
</style>
