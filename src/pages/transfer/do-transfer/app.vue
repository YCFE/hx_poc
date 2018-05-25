<template>
  <div id="app">
    <div class="transfer-box transfer-receive">
      <div class="input-item">
        <span class="input-label">收款方</span>
        <input type="text" class="input-text" placeholder="请输入收款方户名" v-model.trim="form.receiveName">
        <i class="icon icon-contact" @click="open('all-contacts.html', 'from=transfer')"></i>
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
        <i class="icon icon-down"></i>
        <i class="icon icon-edit" @click="editUse"></i>
        <Group class="picker-use">
          <popup-picker :data="data2" @on-change="onUseChange"></popup-picker>
        </Group>
      </div>
    </div>

    <div class="transfer-box transfer-pay">
      <div class="input-item">
        <span class="input-label">付款账户</span>
        <input type="text" class="input-text pay-text" readonly v-model.trim="form.payNum">
        <i class="icon icon-down"></i>
        <Group class="picker-account">
          <popup-picker :data="data" @on-change="onAccountChange"></popup-picker>
        </Group>
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
      <group class="input-group">
        <x-switch title="添加联系人"></x-switch>
      </group>
    </div>
    <div class="transfer-button">
      <button @click="doOrder">预约转账</button>
      <button @click="doSubmit">立即转账</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Group, PopupPicker, XSwitch } from 'vux';
import { getParam } from '@/libs/utils';
import request from '@/libs/request';
import mixins from '@/libs/mixins';
import directives from '@/libs/directives';
import digitUppercase from '@/libs/modules/digit-uppercase';

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
      data: [['6226****3381', '6226****8624', '6226****4675']],
      data2: [['工资', '差旅费', '往来费', '汇款', '贷款', '费用报销', '还款', '其他']],
      nets: {
        '6226****3381': '北京知春支行',
        '6226****8624': '北京方庄支行',
        '6226****4675': '北京学院路支行',
      }
    };
  },
  components: {
    Group,
    PopupPicker,
    XSwitch
  },
  mixins: [mixins],
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
    onUseChange(v) {
      this.form.use = v[0];
    },
    editUse() {
      this.form.use = '';
      this.$refs.useInput.focus();
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
      this.valueupperCase = digitUppercase(v);
      this.form.transforValue = v
        .toString()
        .replace(/(\d)(?=(?:\d{3})+(.\d{1,2})?$)/g, '$1,');
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
        this.alert('请输入收款方户名');
        return false;
      }
      if(!form.receiveNum) {
        this.alert('请输入收款方账户');
        return false;
      }
      if(!form.receiveBank) {
        this.alert('请选择收款银行');
        return false;
      }
      if(!form.receiveNet && form.receiveBank !== '华夏银行') {
        this.alert('请输入开户行');
        return false;
      }
      if(!form.transforValue) {
        this.alert('请输入转账金额');
        return false;
      }
      if(!form.use) {
        this.alert('请输入用途');
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
@import '~@/assets/less/base.less';

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
  input[type="text"],input[type="tel"]{
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
    padding: 0 80px;
    color: #fff;
    font-size: 36px;
    line-height: 2.6;
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
  background-image: url(./imgs/contact.png);
}
.icon-arrow {
  width: 15px;
  height: 31px;
  top: 42px;
  background-image: url(./imgs/arrow.png);
}
.icon-bank {
  width: 34px;
  height: 34px;
  top: 39px;
  background-image: url(./imgs/search.png);
}
.icon-down {
  width: 31px;
  height: 15px;
  top: 48px;
  right: 60px;
  background-image: url(./imgs/arrow-down.png);
}
.icon-edit {
  width: 24px;
  height: 35px;
  top: 38px;
  background-image: url(./imgs/edit.png);
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
.picker-use,.picker-account{
  position: absolute;
  width: 50px;
  height: 50px;
  right: 45px;
  top: 25px;
  overflow: hidden;
  opacity: 0;
}
.picker-account{
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
}
.input-group{
  padding: 10px 30px;
  .weui-cell{
    padding: 15px 0;
  }
  .vux-no-group-title{
    margin-top: 0;
  }
  .weui-cells:after,.weui-cells:before{
    border: none;
  }
}
.weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box{
  background-color: #e14636 !important;
  border-color: #e14636 !important;
}
</style>
