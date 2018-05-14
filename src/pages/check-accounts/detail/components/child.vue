<template>
  <div class="container">
    <!-- Hello {{name}} -->
    <div class="account-detail">
      <ul>
        <li>
          <span class="span-label">账号</span>
          <span class="span-content">{{ options.accountNumber }}</span>
        </li>
        <li>
          <span class="span-label">币种</span>
          <span class="span-content">{{options.currency}}</span>
        </li>
        <li>
          <span class="span-label">账户名称</span>
          <span class="span-content">{{options.accountName}}</span>
        </li>
        <li>
          <span class="span-label">账户余额</span>
          <span class="span-content">{{options.accountBalance}}</span>
        </li>
        <li>
          <span class="span-label">余额日期</span>
          <span class="span-content">{{options.date}}</span>
        </li>
        <li>
          <span class="span-label">余额状态</span>
          <span class="span-content">{{options.state}}</span>
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
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options:
          {
            accountNumber: '',
            currency: '',
            accountName: '',
            accountBalance: '',
            date: '',
            state: '',
            sponsor: '',
            authorizer: '',
            isMatch: '',
            reason: '',
            table: '',
            reply: ''
          }

      }
    },
    methods: {
      getData() {
        request('client.checkAccounts.getDetailData', r => {
          this.options = r.data;
        });
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<style lang="less" scoped>
  @black-gray:#333;
  @light-gray:#999;
  @line-gray:#ddd;
  .container{
    overflow: hidden;
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
