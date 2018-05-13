<template>
  <div class="list-wrap" v-if="options">
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
          <span class="text-color title">账户余额</span>
          <span>{{item.accountBalance}}</span>
        </li>
        <li class="li-dis">
          <span class="text-color title">余额日期</span>
          <span>{{item.date}}</span>
        </li>
        <li class="li-dis-special">
          <span class="text-color title">余额状态</span>
          <span>{{item.state}}</span>
        </li>
        <button class="button-position-set button-detail" @click="detail(index)">详情</button>
      </ul>
    </section>
    <footer class="footer-dis">
      <div class="text-dis text-color" style="text-align: center;">
        共{{totalNumber}}条记录，显示{{fromNumber}}至{{toNumber}}条记录
      </div>
      <div class="footer-button">
        <button class="button-size button-left" @click="nextPage">上一页</button><button class="button-size button-dis" @click="nextPage">下一页</button>
      </div>
    </footer>
  </div>
</template>

<script>
  import request from 'common/js/request';
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        totalNumber: '',
        fromNumber: '1',
        toNumber: '3',
        options: null,
        params: {
          index: ''
        }
      };
    },
    mounted() {
      this.getLists();
    },
    methods: {
      nextPage() {
        this.getLists();
      },
      getLists() {
        request('client.checkAccounts.getCheckLists', r => {
          this.options = r.data;
          this.totalNumber = this.options.length;
        });
      },
      detail(index) {
        console.log(1);
        this.params.index = index;
        console.log(this.params);
        AlipayJSBridge.call('pushWindow', {
          url: 'detail.html',
          data: this.params
        });
      }
    }
  };

</script>

<style lang="less" scoped>
  .footer-dis{
    margin-top: 32px;
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

  button {
    padding:0px;
    border:0px;
    color:#fff;
  }
  .button-left{
    margin-right:50px;
  }
</style>
