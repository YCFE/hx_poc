<template>
  <div id="app">
    <ul class="accredit-list" v-if="counts">
      <li class="accredit-item clearfix" @click="open('transfer.html')">
        <span class="fl">
          <i class="accredit-icon icon1"></i>
          <span class="acreadit-title">转账汇款</span>
          <span class="count">({{counts[0]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix" @click="open('bank-enterprise.html')">
        <span class="fl">
          <i class="accredit-icon icon8"></i>
          <span class="acreadit-title">银企对账</span>
          <span class="count">({{counts[7]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix" @click="open('financial-product.html')">
        <span class="fl">
          <i class="accredit-icon icon2"></i>
          <span class="acreadit-title">理财产品</span>
          <span class="count">({{counts[1]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon3"></i>
          <span class="acreadit-title">贷款查询</span>
          <span class="count">({{counts[2]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon4"></i>
          <span class="acreadit-title">定活互转</span>
          <span class="count">({{counts[3]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon5"></i>
          <span class="acreadit-title">公务卡</span>
          <span class="count">({{counts[4]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon6"></i>
          <span class="acreadit-title">大额存单</span>
          <span class="count">({{counts[5]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
      <li class="accredit-item clearfix">
        <span class="fl">
          <i class="accredit-icon icon7"></i>
          <span class="acreadit-title">代发工资</span>
          <span class="count">({{counts[6]}})</span>
        </span>
        <i class="fr arrow"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import request from '@/libs/request';
  import mixins from '@/libs/mixins';

  export default {
    name: 'accreditIndex',
    data() {
      return {
        counts: null
      }
    },
    mixins,
    methods: {
      getAccounts() {
        request('client.accredit.getCounts', r => {
          this.counts = r.data;
        });
      },
      open(url) {
        AlipayJSBridge.call('pushWindow', {
          url
        });
      }
    },
    mounted() {
      this.getAccounts();
    }
  }

</script>

<style lang="less">
  @import '~@/assets/less/base.less';

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
    background: url(./imgs/arrow.png) no-repeat;
    background-size: contain;
  }
  .accredit-icon,.acreadit-title{
    vertical-align: middle;
  }

  .count{
    display: inline-block;
    color: red;
    vertical-align: middle;
    margin-left: 20px;
  }

  .icon1 {
    background-image: url(./imgs/icon1.png);
  }
  .icon2 {
    background-image: url(./imgs/icon2.png);
  }
  .icon3 {
    background-image: url(./imgs/icon3.png);
  }
  .icon4 {
    background-image: url(./imgs/icon4.png);
  }
  .icon5 {
    background-image: url(./imgs/icon5.png);
  }
  .icon6 {
    background-image: url(./imgs/icon6.png);
  }
  .icon7 {
    background-image: url(./imgs/icon7.png);
  }
  .icon8 {
    background-image: url(./imgs/icon8.png);
  }

</style>
