<template>
  <div class="list-wrap">
    <section>
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
    <footer class="footer-dis">
      <div class="text-dis text-color  record-distance">
        共{{totalNumber}}条记录， 显示{{fromNumber}}至{{toNumber}}条记录
      </div>
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
        totalNumber: 20,
        fromNumber: 7,
        toNumber: 9,
        options: [
          { accountNumber: '11020110446851', currency: '人民币', accountName: '华夏银行厦门分行**公司', checkResult: '相符', result: '通过'},
          { accountNumber: '11020110446968', currency: '人民币', accountName: '华夏银行厦门分行**公司', checkResult: '相符', result: '通过'},
          { accountNumber: '11020110446569', currency: '人民币', accountName: '华夏银行厦门分行**公司', checkResult: '相符', result: '通过'}
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
</style>
