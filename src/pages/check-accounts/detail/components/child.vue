<template>
  <div class="container" v-if="options !== null">
    <div class="account-detail">
      <ul>
        <li>
          <span class="span-label">账号</span>
          <span class="span-content">{{ params.accountNumber }}</span>
        </li>
        <li>
          <span class="span-label">币种</span>
          <span class="span-content">{{options.currency}}</span>
        </li>
        <li>
          <span class="span-label">账户名称</span>
          <span class="span-content">{{params.accountName}}</span>
        </li>
        <li>
          <span class="span-label">账户余额</span>
          <span class="span-content">{{params.accountBalance}}</span>
        </li>
        <li>
          <span class="span-label">余额日期</span>
          <span class="span-content">{{params.date}}</span>
        </li>
        <li>
          <span class="span-label">余额状态</span>
          <span class="span-content">{{params.state}}</span>
        </li>
        <li>
          <span class="span-label">发起人</span>
          <span class="span-content">{{options.sponsor}}</span>
        </li>
        <li>
          <span class="span-label">授权人</span>
          <span class="span-content">{{options.authorizer}}</span>
        </li>
        <li>
          <span class="span-label">调整相符</span>
          <span class="span-content">{{options.isMatch}}</span>
        </li>
        <li>
          <span class="span-label">调整相符原因</span>
          <span class="span-content">{{options.reason}}</span>
        </li>
        <li>
          <span class="span-label">余额调节表</span>
          <span class="span-content">{{options.table}}</span>
        </li>
        <li>
          <span class="span-label">银行回复</span>
          <span class="span-content">{{options.reply}}</span>
        </li>
      </ul>
    </div>
    <img src="~common/img/serrated.png" alt="" class="img-pos">
  </div>
</template>

<script>
  import request from 'common/js/request';
  import utils from 'common/js/utils';

  const { getParam } = utils;

  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options: null,
        params: JSON.parse(decodeURIComponent(getParam('r'))),

      }
    },
    methods: {
      getData() {
        request('client.checkaccounts.getDetailData', r => {
          this.options = r.data;
        });
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<style lang="less">
  @black-gray:#333;
  @light-gray:#999;
  @line-gray:#ddd;
  .container{
    font-size: 30px;
    background: #fff;
  }
  .pull-right{
    float: right;
  }
  .pull-left{
    float: left;
  }
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .account-detail{
    padding: 34px 29px 30px;
    line-height: 50px;
    .span-label{
      color: @light-gray;
      display: inline-block;
      width: 220px;
    }
    .span-content{
      color: @black-gray;
    }
  }
  .img-pos{
    position: absolute;
  }
</style>
