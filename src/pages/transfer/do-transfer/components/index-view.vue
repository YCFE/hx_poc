<template>
  <div id="app">
    <div class="transfer-box transfer-receive">
      <div class="input-item" @click="open('all-contacts.html', 'from=transfer')">
        <span class="input-label">收款方</span>
        <input type="text" class="input-text" placeholder="请输入收款方户名" v-model.trim="form.receiveName">
        <i class="icon icon-contact"></i>
      </div>
      <div class="input-item">
        <span class="input-label">收款账户</span>
        <input type="tel" class="input-text" placeholder="请输入收款方账户" maxlength="19" v-model.trim="form.receiveNum" @input="formatCardNum">
      </div>
      <div class="input-item" @click="open('all-banks.html')">
        <span class="input-label">收款银行</span>
        <input type="text" class="input-text" readonly placeholder="请选择收款银行" v-model.trim="form.receiveBank">
        <i class="icon icon-bank"></i>
      </div>
      <div class="input-item" v-if="form.receiveBank !== '' && form.receiveBank !== '华夏银行'">
        <span class="input-label">开户行</span>
        <input type="text" class="input-text" placeholder="请输入开户行" @input="searchReceiveNets" v-model.trim="form.receiveNet">
        <ul class="nets-downlist" v-if="isShowDownlist">
          <li @click="onClickDownlist('中国银行北京支行')">中国银行北京支行</li>
        </ul>
      </div>
    </div>

    <div class="transfer-box transfer-money">
      <div class="input-item">
        <span class="input-label">转账金额</span>
        <input type="tel" class="input-text" placeholder="请输入转账金额" v-model.trim="form.transforValue" @focus="focusMoney" @change="formatMoney">
      </div>
      <div class="input-item">
        <span class="input-label">大写金额</span>
        <span class="uppercase-text">{{ valueupperCase }}</span>
      </div>
      <div class="input-item">
        <span class="input-label">用途</span>
        <input type="text" class="input-text" ref="useInput" placeholder="请输入用途" v-model.trim="form.use">
        <i class="icon icon-down" @click="showUse"></i>
        <i class="icon icon-edit" @click="editUse"></i>
      </div>
    </div>

    <div class="transfer-box transfer-pay">
      <div class="input-item" @click="showPayAccount">
        <span class="input-label">付款账户</span>
        <input type="text" class="input-text pay-text" readonly v-model.trim="form.payNum">
        <i class="icon icon-down"></i>
      </div>
      <div class="input-item">
        <span class="input-label">开户行</span>
        <input type="text" class="input-text" readonly v-model.trim="form.openNet">
      </div>
      <div class="input-item">
        <span class="input-label">可用金额</span>
        <span class="input-text pay-text">{{form.totalValue}}</span>
      </div>
      <div class="input-item">
        <span class="input-label">短信通知</span>
        <input type="text" class="input-text" v-inputScrollView placeholder="请输入手机号（选填）">
      </div>
      <div class="input-item">
        <span class="input-label">添加联系人</span>
        <mt-switch :value="true"></mt-switch>
      </div>
    </div>
    <div class="transfer-button">
      <button @click="doOrder">预约转账</button>
      <button @click="doSubmit">立即转账</button>
    </div>

    <u-select
      ref="account"
      :slots="slots"
      :on-change="onAccountChange">
    </u-select>

    <u-select
      ref="use"
      :slots="slots2"
      :on-change="onUseChange">
    </u-select>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import uSelect from 'common/components/u-select';
import utils from 'common/js/utils';
import request from 'common/js/request';
import { MessageBox } from 'mint-ui';
import mixins from 'common/js/mixins';
import directives from 'common/js/directives';

const { getParam } = utils;

export default {
  name: 'doTransfer',
  data() {
    return {
      seedId: 'transferEnter',
      isShowDownlist: false,
      form: {
        receiveName: '',
        receiveNum: '',
        transforValue: '',
        transformUpper: '',
        receiveBank: '',
        use: '',
        payNum: '6226****3381',
        openNet: '北京知春支行',
        totalValue: '58000.00'
      },
      valueupperCase: '',
      slots: [{
        values: ['6226****3381', '6226****8624', '6226****4675']
      }],
      slots2: [{
        values: ['工资', '差旅费', '往来费', '汇款', '贷款', '费用报销', '还款', '其他']
      }],
      nets: {
        '6226****3381': '北京知春支行',
        '6226****8624': '北京方庄支行',
        '6226****4675': '北京学院路支行',
      }
    };
  },
  components: {
    uSelect
  },
  mixins,
  directives,
  methods: {
    searchReceiveNets() {
      if(this.form.receiveNet !== '') {
        this.isShowDownlist = true;
      }else{
        this.isShowDownlist = false;
      }
    },
    onClickDownlist(v) {
      this.isShowDownlist = false;
      this.form.receiveNet = v;
    },
    open(url, param = '') {
      AlipayJSBridge.call('pushWindow', {
        url: `${url}?${param}`
      });
    },
    showUse() {
      this.$refs.use.open();
    },
    onUseChange(v) {
      this.form.use = v[0];
    },
    editUse() {
      this.form.use = '';
      this.$refs.useInput.focus();
    },
    showPayAccount() {
      this.$refs.account.open();
    },
    onAccountChange(v) {
      this.form.payNum = v[0];
      this.form.openNet = this.nets[v[0]];
    },
    formatCardNum() {
      const v = this.form.receiveNum;
      this.form.receiveNum = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    },
    focusMoney() {
      let v = this.form.transforValue;
      v = v.toString().replace(/,/g, '');
      this.form.transforValue = v;
    },
    formatMoney() {
      let v = this.form.transforValue;
      v = parseFloat(v);
      v = v.toFixed(2);
      if(v > parseFloat(this.form.totalValue)) {
        v = parseFloat(this.form.totalValue);
      }
      if(isNaN(v)) {
        v = '';
      }
      this.valueupperCase = this.digitUppercase(v);
      this.form.transforValue = v
        .toString()
        .replace(/(\d)(?=(?:\d{3})+(.\d{1,2})?$)/g, '$1,');
    },
    digitUppercase(n) {
      if(!n) {
        return '';
      }
      var fraction = ['角', '分'];
      var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
      var head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整')
      );
    },
    getData(url, cb) {
      request(url, r => {
        this.form = Object.assign({}, this.form, r.data);
        cb && cb();
      });
    },
    checkSubmit() {
      const { form } = this;
      if(!form.receiveName) {
        MessageBox('提示', '请输入收款方户名');
        return false;
      }
      if(!form.receiveNum) {
        MessageBox('提示', '请输入收款方账户');
        return false;
      }
      if(!form.receiveBank) {
        MessageBox('提示', '请选择收款银行');
        return false;
      }
      if(!form.receiveNet && form.receiveBank !== '华夏银行') {
        MessageBox('提示', '请输入开户行');
        return false;
      }
      if(!form.transforValue) {
        MessageBox('提示', '请输入转账金额');
        return false;
      }
      if(!form.use) {
        MessageBox('提示', '请输入用途');
        return false;
      }
      return true;
    },
    initStatus() {
      this.formatCardNum();
    },
    doSubmit() {
      if(!this.checkSubmit()) {
        return;
      }

      const r= encodeURIComponent(JSON.stringify(this.form));

      AlipayJSBridge.call('pushWindow', {
        url: `confirm.html?r=${r}`
      });
    },
    doOrder() {
      if(!this.checkSubmit()) {
        return;
      }

      const r= encodeURIComponent(JSON.stringify(this.form));

      AlipayJSBridge.call('pushWindow', {
        url: `appointment-transfer.html?r=${r}`
      });
    }
  },
  mounted() {
    const bank = getParam('bank');

    if(bank === '1') {
      this.getData('client.transfer.getTransferData', this.initStatus);
    }else if(bank === '2') {
      this.getData('client.transfer.getTransferData2', this.initStatus);
    }

    document.addEventListener('resume', (event) => {
      const bank2 = event.data.bank;
      const bankName = event.data.bankName;

      this.form.receiveBank = bankName;

      if(bank2 == '1') {
        this.getData('client.transfer.getTransferData', this.initStatus);
      }else if(bank2 == '2') {
        this.getData('client.transfer.getTransferData2', this.initStatus);
      }
    });
  }
};
</script>

<style lang="less">
@import '~common/css/base.less';

body {
  background-color: #efeff4;
}

.transfer-box {
  background-color: #fff;
}

.input-item {
  position: relative;
  margin: 0 30px;
  height: 102px;
  line-height: 110px;
  color: #333;
  font-size: 30px;
  border-bottom: 1px #ddd solid;
  background-color: #fff;
  &:last-child {
    border-bottom: none;
  }
  .input-label {
    display: inline-block;
    width: 210px;
  }
  input {
    width: 340px;
    font-size: 30px;
  }
}

.transfer-money,
.transfer-pay {
  margin-top: 28px;
}
.transfer-button {
  margin: 60px 0 0px;
  text-align: center;
  button {
    padding: 30px 80px;
    color: #fff;
    font-size: 36px;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: #e14636;
    &:last-child {
      margin-left: 50px;
    }
  }
}
.icon {
  position: absolute;
  display: inline-block;
  right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
}
.icon-contact {
  width: 33px;
  height: 36px;
  top: 38px;
  background-image: url(../imgs/contact.png);
}
.icon-arrow {
  width: 15px;
  height: 31px;
  top: 42px;
  background-image: url(../imgs/arrow.png);
}
.icon-bank {
  width: 34px;
  height: 34px;
  top: 39px;
  background-image: url(../imgs/search.png);
}
.icon-down {
  width: 31px;
  height: 15px;
  top: 48px;
  right: 60px;
  background-image: url(../imgs/arrow-down.png);
}
.icon-edit {
  width: 24px;
  height: 35px;
  top: 38px;
  background-image: url(../imgs/edit.png);
}
.mint-switch {
  position: absolute;
  right: 0;
  top: 14px;
  display: inline-block;
}
.mint-switch-input:checked + .mint-switch-core {
  background-color: #e14636;
  border-color: #e14636;
}
.uppercase-text{
  display: inline-block;
  width: 400px;
  vertical-align: middle;
}
.pay-text{
  color: #e14636;
}
.nets-downlist{
  position: absolute;
  top: 110px;
  width: 400px;
  left: 220px;
  border: 1px #ddd solid;
  background-color: #fff;
  z-index: 10;
  li{
    height: 80px;
    line-height: 86px;
    padding: 0px 30px;
    color: #333;
    font-size: 30px;
    border-bottom: 1px #ddd solid;
    &:last-child{
      border-bottom: none;
    }
  }
}
</style>
