<template>
  <div class="container">
    <!-- Hello {{name}} -->
    <div class="account-detail">
      <ul>
        <li>
          <span class="span-label">账号</span>
          <span class="span-content">11020110446967</span>
        </li>
        <li>
          <span class="span-label">币种</span>
          <span class="span-content">人民币</span>
        </li>
        <li>
          <span class="span-label">账户名称</span>
          <span class="span-content">华夏银行厦门分行**公司</span>
        </li>
        <li>
          <span class="span-label">账户余额</span>
          <span class="span-content">18,850,000</span>
        </li>
        <li>
          <span class="span-label">余额日期</span>
          <span class="span-content">2018-05-05</span>
        </li>
        <li>
          <span class="span-label">余额状态</span>
          <span class="span-content">余额相符</span>
        </li>
        <li>
          <span class="span-label">发起人</span>
          <span class="span-content">经办人01</span>
        </li>
        <li>
          <span class="span-label">授权人</span>
          <span class="span-content">授权员01</span>
        </li>
        <li>
          <span class="span-label">调整相符</span>
          <span class="span-content">否</span>
        </li>
        <li>
          <span class="span-label">调整相符原因</span>
          <span class="span-content">无</span>
        </li>
        <li>
          <span class="span-label">余额调节表</span>
          <span class="span-content"></span>
        </li>
        <li>
          <span class="span-label">银行回复</span>
          <span class="span-content"></span>
        </li>
      </ul>
    </div>
    <img src="~common/img/serrated.png" alt="" class="img-pos">
  </div>
</template>

<script>

  export default {
    name: 'child',
    data() {
      return {
        name: 'child'
      }
    },
    mounted() {
      /* let h = document.documentElement.clientHeight - 8;
      document.getElementsByTagName('body')[0].style.height = h+'px';
      document.getElementsByTagName('body')[0].style.margin = 0;
      document.getElementsByTagName('body')[0].style.backgroundColor = '#efeff4'; */
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
