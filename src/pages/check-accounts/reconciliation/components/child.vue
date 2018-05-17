<template>
  <div v-if="options">
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
          <input class="reason-input" type="text" v-if="item.state === '拒绝授权'" placeholder="请输入拒绝授权原因" v-focus v-model="item.reason">
        </li>
      </ul>
    </section>
    <p class="page-info">
       共12条记录，显示7至9条记录
    </p>
    <div class="page-count clearfix">
      <span class="fl">
        <a href="javascript:;" @click="getData">上一页</a>/<a href="javascript:;" @click="getData">第一页</a>
      </span>
      <span class="fr">
        <a href="javascript:;" @click="getData">下一页</a>/<a href="javascript:;" @click="getData">最后一页</a>
      </span>
    </div>
    <div class="input-button">
      <button class="btn btn-primary" @click="doSubmit">下一步</button>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import request from 'common/js/request';
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options:null,
      }
    },
    directives: {
      focus: {
        inserted: function(el) {
          el.focus();
        }
      }
    },
    methods: {
      checkSubmit() {
        const r = this.options.every(obj => {
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

        const length = this.options.filter(el => {
          return el.state !== ''
        }).length;

        AlipayJSBridge.call('pushWindow', {
          url: `code.html?length=${length}`
        });
      },
      getData() {
        request('client.checkaccounts.getReconciliationData', r => {
          this.options = r.data;
        });
      }
    },
    mounted() {
      document.addEventListener('resume', () => {
        this.options.forEach(el => {
          el.state = '';
          el.reason = '';
        });
      });
      this.getData();
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
    margin: 30px 30px 0;
  }
  .list-wrap{
    font-size: 30px;
  }
  .li-dis{
    span:first-child{
      width: 180px;
    }
  }
  .page-count {
    color: #a1a1a1;
    font-size: 28px;
    margin: 50px 28px 0;
    a {
      color: #a1a1a1;
      font-size: 28px;
    }
  }
  .reason-input{
    width: 400px;
    border: none !important;
    height: 60px;
    &::-webkit-input-placeholder{
      color:#e14636;
    }
  }
</style>
