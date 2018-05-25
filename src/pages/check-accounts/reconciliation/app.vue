<template>
  <div v-if="options">
    <section class="list-wrap">
      <ul style="position: relative" class="border-set" v-for="(item, index) in options" :key="index">
        <li class="li-dis special">
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
          <checklist :options="[ '同意授权', '拒绝授权']" v-model="item.state" :max="1"></checklist>
        </li>
        <li>
          <input class="reason-input" type="text" v-if="item.state[0] === '拒绝授权'" v-focus v-model="item.reason" placeholder="请输入拒绝授权原因">
        </li>
      </ul>
    </section>
    <p class="page-info">
       共3条记录，显示1至3条记录
    </p>
   <!--  <div class="page-count clearfix">
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
import { mapState } from 'vuex';
import  mixins  from '@/libs/mixins';
import request from '@/libs/request';
import { getParam } from '@/libs/utils';
import { Checklist } from 'vux';

export default {
  name: 'checkAccountsReconciliation',
  components:{
    Checklist
  },
  data() {
    return {
      options: null
    };
  },
  mixins: [mixins],
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    checkSubmit() {
      const r = this.options.some(obj => {
        return obj.state === '';
      });

      if (r) {
        this.alert('请选择是否同意授权');
        return false;
      }

      const r2 = this.options.some(obj => {
        console.log(obj);
        return obj.state[0] === '拒绝授权' && obj.reason === '';
      });
      console.log(r2);
      if (r2) {
       this.alert('请输入拒绝授权原因');
        return false;
      }

      return true;
    },
    doSubmit() {
      if (!this.checkSubmit()) {
        return;
      }

      const arr = this.options.map(el => el.state).join(',');

      /* AlipayJSBridge.call('pushWindow', {
        url: `check-reunite.html?r=${arr}`
      }); */
      AlipayJSBridge.call('pushWindow', {
        url: 'reconciliation-result.html'
      });

    },
    getData() {
      request('client.checkaccounts.getData', r => {
        this.options = r.data;
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="less">
@import '~@/assets/less/base.less';
.radio-item {
  margin-top: -10px !important;
}
.page-info {
  margin: 30px 28px 0;
  color: #a1a1a1;
  font-size: 28px;
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
.input-button {
  margin: 30px 28px 50px;
}
.reason-input {
  width: 400px;
  border: none !important;
  height: 60px;
  &::-webkit-input-placeholder {
    color: #e14636;
  }
}
.radio-item{
  label{
    display: inline-block;
    padding: 20px 20px 20px 0;
  }
  .weui-cells:before{
    display: none;
  }
  .weui-cell:before{
    display: none;
  }
  .weui-cells:after{
    display: none;
  }
  .weui-cell__hd{
    float: left;
    margin-top: -3px;
  }
  .weui-cell__bd{
    display: inline-block;
  }
  .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before{
    color: #e14636;
  }
  .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before{
    color: #e14636;
  }
}
</style>
