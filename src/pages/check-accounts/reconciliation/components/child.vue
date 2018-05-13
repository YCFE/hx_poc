<template>
  <div>
    <section class="list-wrap">
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
          <span class="text-color title">账户余额</span>
          <span>{{item.accountBalance}}</span>
        </li>
        <li class="border_none li-dis">
          <span class="text-color title">余额日期</span>
          <span>{{item.date}}</span>
        </li>
        <li class="radio-item">
          <mt-radio
            v-model="item.state"
            :options="['同意授权', '拒绝授权']">
          </mt-radio>
        </li>
        <li>
          <input class="reason-input" type="text" v-if="item.state === '拒绝授权'" placeholder="拒绝授权原因">
        </li>
      </ul>
    </section>
    <p class="page-info">
       共12条记录，显示7至9条记录
    </p>
    <!-- <div class="page-count clearfix">
      <span class="fl">
        <a href="javascript:;">上一页</a>/<a href="javascript:;">第一页</a>
      </span>
      <span class="fr">
        <a href="javascript:;">下一页</a>/<a href="javascript:;">最后一页</a>
      </span>
    </div> -->
    <div class="input-button">
      <button class="btn btn-primary" @click="doSubmit">下一步</button>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options:[
          { accountNumber: '12312356', currency: '人民币', accountName: '李晓', accountBalance: '12.00', date: '2018-01-15', state: '' },
          { accountNumber: '12312356', currency: '人民币', accountName: '李晓', accountBalance: '12.00', date: '2018-01-15', state: '' },
          { accountNumber: '12312356', currency: '人民币', accountName: '李晓', accountBalance: '12.00', date: '2018-01-15', state: '' },
        ],
      }
    },
    methods: {
      checkSubmit() {
        const r = this.options.some(obj => {
          return obj.state === ''
        });

        if(r) {
          MessageBox('提示', '请选择是否同意授权');
          return false;
        }

        const r2 = this.options.some(obj => {
          return obj.state === '拒绝授权' && obj.reason === '';
        });

        if(r2) {
          MessageBox('提示', '请输入拒绝授权原因');
          return false;
        }

        return true;

      },
      doSubmit() {
        if(!this.checkSubmit()) {
          return;
        }

        AlipayJSBridge.call('pushWindow', {
          url: 'reconciliation-result.html',
          params: {
            count: this.options.length
          }
        });
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  .page-info{
    margin: 30px 28px 64px;
    color: #a1a1a1;
    font-size: 28px;
  }
  .mint-cell{
    background: none;
  }
  .input-button{
    margin: 0 30px;
  }
  .list-wrap{
    font-size: 30px;
  }
  .li-dis{
    span:first-child{
      width: 180px;
    }
  }
  .reason-input{
    border: none !important;
    height: 60px;
    &::-webkit-input-placeholder{
      color:#e14636;
    }
  }
</style>
