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
          <span class="text-color title">对账结果</span>
          <span>{{item.checkResult}}</span>
        </li>
        <li class="border_none li-dis-special">
          <span class="text-color title">复核结果</span>
          <span>{{item.result}}</span>
        </li>
      </ul>
    </section>
    <footer class="footer-dis list-wrap">
      <div class="text-dis text-color  record-distance">共12条记录，显示7至9条记录</div>
      <div class="text-color page">
        <span>上一页</span>
        <span>/</span>
        <span>第一页</span>
        <span class="next-page">下一页</span>
        <span>/</span>
        <span>最后一页</span>
      </div>
      <div class="footer-button">
        <button class="button-size button-dis btn">下一步</button>
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
          { accountNumber: '11020110446967', currency: '人民币', accountName: '华夏银行厦门分行**公司', checkResult: '相符', result: '通过'},
          { accountNumber: '11020110446967', currency: '人民币', accountName: '华夏银行厦门分行**公司', checkResult: '相符', result: '通过'},
          { accountNumber: '11020110446967', currency: '人民币', accountName: '华夏银行厦门分行**公司', checkResult: '相符', result: '通过'}
        ]
      };
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  .footer-dis{
    margin-top: 32px;
  }
  .text-color{
    color:#A1A1A1;
  }
  .currency-distance{
    margin-left:58px;
  }
  .footer-button{
    text-align: center;
  }
  .button-size{
    height: 100px;
    background-color: #E14535;
    border-radius: 10px;
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
  .page{
    margin:57px 0px 29px 15px
  }
  .next-page{
    margin-left: 220px;
  }
</style>
