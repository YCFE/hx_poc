<template>
  <div class="list-wrap" v-if="options">
    <section>
      <ul style="position: relative" class="border-set" v-for="(item, index) in options" :key="index">
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
          <span>{{state[index]}}</span>
        </li>
        <!-- <li class="li-dis-special">
          <span class="text-color title">复核结果</span>
          <span>{{item.result}}</span>
        </li> -->
      </ul>
    </section>
    <footer class="footer-dis">
      <div class="text-dis text-color  record-distance">
        共{{totalNumber}}条记录， 显示{{fromNumber}}至{{toNumber}}条记录
      </div>
      <div class="text-color page">
        <span @click="getLists">上一页</span>
        <span>/</span>
        <span @click="getLists">第一页</span>
        <span class="next-page" @click="getLists">下一页</span>
        <span>/</span>
        <span @click="getLists">最后一页</span>
      </div>
      <div class="footer-button">
        <button class="button-size button-dis btn" @click="nextStep">下一步</button>
      </div>
    </footer>
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
        totalNumber: '',
        fromNumber: 1,
        toNumber: 3,
        options: null,
        state: getParam('r').split(',')
      };
    },
    mounted() {
      this.getLists();
    },
    methods: {
      getLists() {
        request('client.checkAccounts.getCheckReunite', r => {
          this.options = r.data;
          this.totalNumber = r.data.length;
        });
      },
      nextStep() {
        AlipayJSBridge.call('pushWindow', {
          url: 'result.html'
        });
      }
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
