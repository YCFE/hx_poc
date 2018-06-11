<template>
  <div v-if="options !== null">
    <div class="bg-white">
      <div class="top">
        <h3>{{ options.no }}</h3>
        <div class="clearfix">
          <div class="pull-left" style="position: relative">
            <span>户名：</span>
            <input type="text" value="" v-model="options.name">
            <span class="pencil pencil-position" @click.stop="edit"></span>
          </div>
          <div class="pull-right">
            <span>余额：{{ options.balance1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-content">
      <ul>
        <li>
          <label for="">可用余额</label>
          <input type="text" readonly value="" v-model="options.balance">
        </li>
        <li class="clearfix">
          <label for="">开户机构</label>
          <input type="text" readonly value="" v-model="options.mechanism">
        </li>
      </ul>
    </div>
    <div>
      <div class="account-detail">
        <ul>
          <li>
            <span class="span-label">账号余额</span>
            <span class="span-content">{{ options.balance1 }}</span>
          </li>
          <li>
            <span class="span-label">账户性质</span>
            <span class="span-content">{{options.type}}</span>
          </li>
          <li>
            <span class="span-label">最近交易日期</span>
            <span class="span-content">{{options.time}}</span>
          </li>
          <li>
            <span class="span-label">开户日期</span>
            <span class="span-content">{{options.date}}</span>
          </li>
          <li>
            <span class="span-label">币种</span>
            <span class="span-content">{{options.currency}}</span>
          </li>
          <li>
            <span class="span-label">是否计息</span>
            <span class="span-content">{{options.interest}}</span>
          </li>
        </ul>
      </div>
      <img src="~@/assets/img/serrated.png" alt="" class="img-pos">
    </div>
    <div class="search-button"><button class="btn btn-primary" @click="default1()">设为默认</button></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/libs/request';
import mixins from '@/libs/mixins';

export default {
  name: 'balanceDetail',
  data() {
    return {
      showChoose: false,
      options: null
    }
  },
  mixins: [mixins],
  methods: {
    getData(){
      request('client.balance.getDetailData', r => {
        this.options = r.data;
      });
    },
    edit() {
      this.showChoose = !this.showChoose;
      this.$refs.reason.focus();
      this.options.account = '';
    },
    default1(){
      request('client.balance.setDefault', () => {
        AlipayJSBridge.call('toast', {
          content: '设置成功',
          type: 'success',
          duration: 2000
        }, function() {
          AlipayJSBridge.call('popTo', {
            urlPattern: 'index.html'
          })
        });
      })
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style lang="less">
@import '~@/assets/less/base.less';
.search-button{
  margin: 120px 30px 0;
}
body{
  background: #efeff4;
}
.bg-white{
  background: #fff;
  padding: 30px 30px 0 30px;
}
.pull-left{
  float: left;
}
.pull-right{
  float: right;
}
.clearfix{
  display: block;
  clear:both;
}
.pencil{
  background-image: url('~@/assets/img/pencil-red.png');
  background-size: 25px 35px;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;
  display: inline-block;
  margin-left:34px;
}
.pencil-position{
  position: absolute;
  top:-8px;
  right:0px;
}
.top{
  //margin: 30px 30px 0 30px;
  background: #E14535;
  padding: 50px 30px 20px 30px;
  color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  h3{
    font-size: 48px;
    text-align: center;
    font-weight: normal;
    margin-bottom: 55px;
  }
  span,input{
    font-size: 30px;
  }
  input{
    width: 240px;
    background: #E14535;
    color: #fff;
  }
}
.detail-content{
  //margin: 0 30px;
  background: #fff;
  font-size: 30px;
  li{
    padding: 50px 30px 20px;
    border-bottom: 1px solid #ddd;
    label{
      color: #333;
    }
    input,.input-div{
      float: right;
      text-align: right;
      color: #999;
      width: 455px;
    }
  }
  li:last-child{
    border-bottom: none;
  }
  textarea{
    float: right;
      text-align: right;
      color: #999;
      width: 455px;
  }
}
.account-detail{
  margin-top: 30px;
  padding: 34px 29px 30px;
  line-height: 50px;
  background: #fff;
  .span-label{
    color: #999;
    display: inline-block;
    width: 220px;
  }
  .span-content{
    color: #333;
  }
}
.img-pos{
  width: 100%;
  position: absolute;
}
</style>
