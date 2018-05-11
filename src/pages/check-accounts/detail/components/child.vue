<template>
  <div class="container">
    <!-- Hello {{name}} -->
    <div class="account-detail">
      <ul v-for="(item,index) in options" :key="index">
        <li>
          <span class="span-label">账号</span>
          <span class="span-content">{{ item.accountNumber }}</span>
        </li>
        <li>
          <span class="span-label">币种</span>
          <span class="span-content">{{item.currency}}</span>
        </li>
        <li>
          <span class="span-label">账户名称</span>
          <span class="span-content">{{item.accountName}}</span>
        </li>
        <li>
          <span class="span-label">账户余额</span>
          <span class="span-content">{{item.accountBalance}}</span>
        </li>
        <li>
          <span class="span-label">余额日期</span>
          <span class="span-content">{{item.date}}</span>
        </li>
        <li>
          <span class="span-label">余额状态</span>
          <span class="span-content">{{item.state}}</span>
        </li>
        <li>
          <span class="span-label">发起人</span>
          <span class="span-content">{{item.sponsor}}</span>
        </li>
        <li>
          <span class="span-label">授权人</span>
          <span class="span-content">{{item.authorizer}}</span>
        </li>
        <li>
          <span class="span-label">调整相符</span>
          <span class="span-content">{{item.isMatch}}</span>
        </li>
        <li>
          <span class="span-label">调整相符原因</span>
          <span class="span-content">{{item.reason}}</span>
        </li>
        <li>
          <span class="span-label">余额调节表</span>
          <span class="span-content">{{item.table}}</span>
        </li>
        <li>
          <span class="span-label">银行回复</span>
          <span class="span-content">{{item.reply}}</span>
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
        name: 'child',
        options: [
          {
            accountNumber: '12312356',
            currency: '人民币',
            accountName: '李晓',
            accountBalance: '12.00',
            date: '2018-01-15',
            state: '状态',
            sponsor: '发起人',
            authorizer: '授权人',
            isMatch: '否',
            reason: '原因',
            table: '',
            reply: ''
          }
        ]
      }
    },
    mounted() {

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
