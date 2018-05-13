<template>
  <div id="app">
    <ul class="accredit-list">
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon1"></i>
          <span class="acreadit-title">转账汇款</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon2"></i>
          <span class="acreadit-title">理财产品</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon3"></i>
          <span class="acreadit-title">贷款查询</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon4"></i>
          <span class="acreadit-title">定活互转</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon5"></i>
          <span class="acreadit-title">公务卡</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon6"></i>
          <span class="acreadit-title">大额存单</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon7"></i>
          <span class="acreadit-title">代发工资</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon8"></i>
          <span class="acreadit-title">银企对账</span>
        </span>
        <i class="fr arrow"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import request from 'common/js/request';

  export default {
    name: 'accreditIndex',
    data() {
      return {

      }
    },
    methods: {
      getAccounts() {
        request('client.accredit.getAccounts', r => {
          console.log(r,222)
        });
      }
    },
    mounted() {
      this.getAccounts();
    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';

  .accredit-list{
    margin: 0 28px;
  }
  .accredit-item{
    padding: 35px 0;
    color: #333;
    font-size: 30px;
    border-bottom: 1px #ddd solid;
  }
  .accredit-icon{
    display: inline-block;
    width: 45px;
    height: 45px;
    margin-right: 36px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
  .arrow{
    width: 15px;
    height: 31px;
    margin-top: 6px;
    background: url(../imgs/arrow.png) no-repeat;
    background-size: contain;
  }
  .accredit-icon,.acreadit-title{
    vertical-align: middle;
  }

  .icon1 {
    background-image: url(../imgs/icon1.png);
  }
  .icon2 {
    background-image: url(../imgs/icon2.png);
  }
  .icon3 {
    background-image: url(../imgs/icon3.png);
  }
  .icon4 {
    background-image: url(../imgs/icon4.png);
  }
  .icon5 {
    background-image: url(../imgs/icon5.png);
  }
  .icon6 {
    background-image: url(../imgs/icon6.png);
  }
  .icon7 {
    background-image: url(../imgs/icon7.png);
  }
  .icon8 {
    background-image: url(../imgs/icon8.png);
  }

</style>
