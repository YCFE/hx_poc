<template>
  <div>
    <div class="top">
      <h3>6229 **** 9999</h3>
      <div class="clearfix">
        <div class="pull-left" style="position: relative">
          <span>户名：</span>
          <input type="text" value="老大的公司">
          <span class="pencil pencil-position" @click.stop="edit"></span>
        </div>
        <div class="pull-right">
          <span>余额：43,1000.00</span>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <ul>
        <li>
          <label for="">可用余额</label>
          <input type="text" readonly value="" v-model="options.balance">
        </li>
        <li>
          <label for="">开户机构</label>
          <input type="text" readonly value="" v-model="options.mechanism">
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
  name: 'balanceDetail',
  data() {
    return {
      showChoose: false,
      options: {
        balance: '￥43,1000.00',
        mechanism: '一二三四五六七八九十 一二三四五六七八九十'
      }
    }
  },
  mixins: [mixins],
  methods: {

  },
  mounted() {

  }
}
</script>

<style lang="less">
@import '~@/assets/less/base.less';
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
  margin: 30px 30px 0 30px;
  background: #E14535;
  padding: 50px 30px 20px 30px;
  color: #fff;
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
</style>
