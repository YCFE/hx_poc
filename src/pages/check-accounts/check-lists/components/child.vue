<template>
  <div>
    <section class="list-wrap">
      <ul style="position: relative" class="border-set" v-for="(item, index) in options">
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
          <span class="text-color title">账户余额</span>
          <span>{{item.accountBalance}}</span>
        </li>
        <li class="border_none li-dis">
          <span class="text-color title">余额日期</span>
          <span>{{item.date}}</span>
        </li>
        <li class="border_none li-dis-special">
          <span class="text-color title">余额状态</span>
          <span>{{item.state}}</span>
        </li>
        <button class="button-position-set button-detail">详情</button>
      </ul>
    </section>
    <footer class="footer-dis">
      <div class="text-dis text-color" style="text-align: center;">共12条记录，显示7至9条记录</div>
      <div class="footer-button">
        <button class="button-size button-left">上一页</button><button class="button-size button-dis">下一页</button>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options: [
          { accountNumber: '12312356', currency: '人民币', accountName: '李晓', accountBalance: '12.00', date: '2018-01-15', state: '余额相符' },
          { accountNumber: '12312356', currency: '人民币', accountName: '李晓', accountBalance: '12.00', date: '2018-01-15', state: '余额相符' },
          { accountNumber: '12312356', currency: '人民币', accountName: '李晓', accountBalance: '12.00', date: '2018-01-15', state: '余额相符' },
        ]
      };
    },
    mounted() {

    }
  };

</script>

<style lang="less" scoped>
  .footer-dis{
    margin-top: 32px;
  }
  .text-dis{
    margin-bottom: 32px;
  }
  .text-color{
    color:#A1A1A1;
  }
  .button-detail{
    width: 102px;
    height: 54px;
    background-color: #E14535;
    border-radius: 2px;
  }

  .currency-distance{
    margin-left:58px;
  }
  .footer-button{
    text-align: center;
  }
  .button-size{
    height: 100px;
    width:320px;
    background-color: #E14535;
    border-radius: 10px;
    margin: 10px 0px 10px 0px;
  }
  .border-set{
    border-bottom: 1px solid #DDDDDD;
  }
  .special{
    margin-top: 50px;
  }
  button {
    padding:0px;
    border:0px;
    color:#fff;
  }
  .button-left{
    margin-right:50px;
  }
</style>
