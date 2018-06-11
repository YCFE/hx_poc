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
            <span>余额：{{ options.balance }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <ul class="clearfix">
        <li @click="detail">
          <img src="~@/assets/img/1_08.png" alt="">
          <p>账户详情</p>
        </li>
        <li>
          <img src="~@/assets/img/1_03.png" alt="">
          <p>明细查询</p>
        </li>
        <li>
          <img src="~@/assets/img/1_05.png" alt="">
          <p>转账汇款</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from '@/libs/request';
import mixins from '@/libs/mixins';

export default {
  name: 'balanceSearch',
  data() {
    return {
      showChoose: false,
      options: null
    }
  },
  mixins: [mixins],
  methods: {
    getData(){
      request('client.balance.getSearchData', r => {
        this.options = r.data;
      });
    },
    detail(){
      AlipayJSBridge.call('pushWindow', {
        url: 'detail.html'
      });
    },
    search(){
      AlipayJSBridge.call('pushWindow', {
        url: 'search.html'
      });
    },
    tran(){
      AlipayJSBridge.call('pushWindow', {
        url: '/accredit/transfer.html'
      });
    },
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
  background: #fff;
  padding: 0 30px 30px;
  ul{
    border: 1px solid #efeff4;
    padding-top: 30px;
    padding-bottom: 30px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  li{
    text-align: center;
    float: left;
    border-right: 1px solid #efeff4;
    padding: 10px 20px;
    color: #686868;
    font-size: 24px;
    width: 33.3%;
    p{
      color: #686868;
      font-size: 24px;
      margin-top: 10px;
    }
    img{
      display: inline-block;
      width: 40px;
      height: 45px;
    }
  }
  li:last-child{
    border-right: none;
  }
}
</style>
