<template>
  <div v-if="options">
    <section>
        <ul class="list-wrap" v-for="(item, index) in options" :key="index">
          <li class="text-padding right-re">
            <span class="name">账号名称</span>
            <span class="name-position font-color">{{item.name}}</span>
          </li>
          <li class="text-padding right-re">
            <span>存款类型</span>
            <span class="right-position font-color">{{item.style}}</span>
          </li>
          <li class="text-padding right-re">
            <span>余额</span>
            <span class="right-position font-color">￥{{item.balance}}</span>
          </li>
          <li class="text-padding right-re">
            <span class="">余额日期</span>
            <span class="right-position font-color">{{item.balanceDate}}</span>
          </li>
          <li class="text-padding right-re">
            <span>对账结果</span>
            <span class="result-position font-color">{{item.result}}</span>
            <span class="right-position" style="color:#e14636;">{{item.appointment}}</span>
          </li>
        </ul>
        <div class="space"></div>
        <ul class="list-wrap" v-for="(item, index) in options">
         <li class="text-padding right-re">
           <span class="name">账号名称</span>
           <span class="name-position font-color">{{item.accountName}}</span>
         </li>
         <li class="text-padding right-re">
           <span class="">存款类型</span>
           <span class="right-position font-color">{{item.accountStyle}}</span>
         </li>
         <li class="text-padding right-re">
           <span class="">余额</span>
           <span class="right-position font-color">￥{{item.accountBalance}}</span>
         </li>
      </ul>
    </section>
    <footer class="list-wrap">
      <button class="btn btn-primary btn-size btn-position" @click="refuse">拒绝</button>
      <button class="btn btn-primary btn-size" @click="agree">同意</button>
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
        options: null
      };
    },
    mounted() {
      this.getLists();
    },
    methods: {
      getLists() {
        request('client.accredit.getAccountContext', r => {
          this.options = r.data;
        });
      },
      refuse() {
        AlipayJSBridge.call('pushWindow', {
          url: 'refusal-reason.html'
        });
      },
      agree() {
        AlipayJSBridge.call('pushWindow', {
          url: 'code.html'
        });
      }
    }
  }

</script>

<style lang="less">
  .list-wrap{
    .font-color{
      color:#999999;
    }
    .btn-size{
      width: 320px;
      height: 100px;
      display: inline-block;
    }
    .btn-position{
      margin-right:45px;
      margin-top: 46px;
    }
    .name{
      padding:0px 122px 35px 0px;
      display: inline-block;
    }
    .name-position{
      position: absolute;
      top:32px;
    }
    .text-padding {
      padding:35px 0;
      display: inline-block;
      margin-top:21px;
      border-bottom: 1px solid #dddddd;
      width: 100%;
    }
    .result-position {
      position: absolute;
      top:32px;
      right:158px;
    }
    .right-position {
     position: absolute;
     top:32px;
     right:0px;
   }
    .right-re{
      position: relative;
    }
  }
  .space{
    background-color: #EFEFF4;
    height: 20px;
    width: 100%;
  }
</style>
