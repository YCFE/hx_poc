<template>
  <div id="app" v-if="options">
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
          <mt-radio
            v-model="item.state"
            :options="['余额相符', '余额不符']">
          </mt-radio>
        </li>
        <li>
          <input class="reason-input" type="text" v-if="item.state === '余额不符'" v-focus v-model="item.reason" placeholder="请输入余额不符原因">
        </li>
      </ul>
    </section>
    <p class="page-info">
       共3条记录，显示1至3条记录
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
      <button class="btn btn-primary" @click="doSubmit">确认对账</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { MessageBox } from 'mint-ui';
import request from 'common/js/request';
import mixins from 'common/js/mixins';

export default {
  name: 'accountInput',
  data() {
    return {
      options: null
    };
  },
  mixins,
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
        MessageBox('提示', '请选择余额是否相符');
        return false;
      }

      const r2 = this.options.some(obj => {
        return obj.state === '余额不符' && obj.reason === '';
      });

      if (r2) {
        MessageBox('提示', '请输入余额不符原因');
        return false;
      }

      return true;
    },
    doSubmit() {
      if (!this.checkSubmit()) {
        return;
      }

      const arr = this.options.map(el => el.state).join(',');

      AlipayJSBridge.call('pushWindow', {
        url: `check-reunite.html?r=${arr}`
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
@import '~common/css/base.less';

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
  margin: 30px 28px 0px;
}
.reason-input {
  width: 400px;
  border: none !important;
  height: 60px;
  &::-webkit-input-placeholder {
    color: #e14636;
  }
}
</style>
