<template>
  <div id="app">
    <div class="search-box">
      <!-- <group>
        <popup-picker
          title="账号"
          :data="slots"
          v-model="search.account"
          placeholder="全部">
        </popup-picker>
        <popup-picker
          title="对账情况"
          :data="typeList"
          v-model="search.type"
          placeholder="全部">
        </popup-picker>
        <datetime title="开始日期" :start-date="startDate" :end-date="endDate" v-model="search.startDate"></datetime>
        <datetime title="结束日期" :start-date="startDate" :end-date="endDate" v-model="search.endDate"></datetime>
      </group> -->
      <div class="group-item">
        <div class="search-item clearfix">
          <span class="search-label fl">账号</span>
          <span class="search-value fr">
            <span class="search-text">{{search.account}}</span>
            <i class="search-arrow"></i>
          </span>
        </div>
        <group class="picker-opacity">
          <popup-picker
            title="账号"
            :data="slots"
            v-model="search.accountHidden"
            placeholder="全部">
          </popup-picker>
        </group>
      </div>
      <div class="group-item">
        <div class="search-item clearfix">
          <span class="search-label fl">对账情况</span>
          <span class="search-value fr">
            <span class="search-text">{{search.type}}</span>
            <i class="search-arrow"></i>
          </span>
        </div>
        <group class="picker-opacity">
          <popup-picker
            title="对账情况"
            :data="typeList"
            v-model="search.typeHidden"
            placeholder="全部">
          </popup-picker>
        </group>
      </div>
      <div class="group-item">
        <div class="search-item clearfix">
          <span class="search-label fl">开始日期</span>
          <span class="search-value fr">
            <span class="search-text calendar-text">{{search.startDate}}</span>
            <i class="search-calendar"></i>
            <i class="search-arrow"></i>
          </span>
        </div>
        <group class="picker-opacity">
          <datetime title="开始日期" :start-date="startDate" :end-date="endDate" v-model="search.startDate"></datetime>
        </group>
      </div>
      <div class="group-item">
        <div class="search-item clearfix">
          <span class="search-label fl">结束日期</span>
          <span class="search-value fr">
            <span class="search-text calendar-text">{{search.endDate}}</span>
            <i class="search-calendar"></i>
            <i class="search-arrow"></i>
          </span>
        </div>
        <group class="picker-opacity">
          <datetime title="结束日期" :start-date="startDate" :end-date="endDate" v-model="search.endDate"></datetime>
        </group>
      </div>
      <div class="search-button">
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import { PopupPicker,Group,Datetime } from 'vux';
import request from '@/libs/request';
import mixins from '@/libs/mixins';


const format = (n) => {
  return n < 10 ? `0${n}`: `${n}`;
};

const startDate = new Date();

startDate.setMonth(startDate.getMonth() - 6);
const start = startDate.getFullYear() + '-' +  format((startDate.getMonth() + 1)) + '-' + format(startDate.getDate());

const date = new Date();
const startDate1 = date.getFullYear() + '-' + format((date.getMonth() + 1)) + '-' + format(date.getDate());

export default {
  name: 'search',
  components: {
    PopupPicker,
    Group,
    Datetime
  },
  mixins:[mixins],
  data() {
    return {
      search: {
        accountHidden: ['全部'],
        typeHidden: ['全部'],
        account: '全部',
        type: '全部',
        startDate: startDate1,
        endDate: startDate1
      },
      slots: [],
      typeList:[['全部','已对账','未对账']],
      startDate: start,
      endDate: startDate1
    };
  },
  methods: {
    doSearch() {
      AlipayJSBridge.call('pushWindow', {
        url: 'check-lists.html'
      });
    },
    getAccounts() {
      request('client.checkaccounts.getAccounts', r => {
        this.slots = [r.data];
      });
    },
    getTime(){
      let date = new Date();
      this.search.startDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    }
  },
  mounted() {
    this.getAccounts();
    this.getTime();
  },
  updated(){
    this.search.account = this.search.accountHidden.toString();
    this.search.type = this.search.typeHidden.toString();
  }
};
</script>

<style lang="less">
@import '~@/assets/less/base.less';
.search-box label,p,span{
  font-size: 30px !important;
}
.search-box {
  margin: 0;
  .vux-no-group-title{
    margin-top: 0;
  }
}
.search-item {
  padding: 36px 0;
  color: #333;
  font-size: 30px;
  border-bottom: 1px #ddd solid;
}
.search-label {
  margin-top: 4px;
}
.search-arrow {
  width: 15px;
  height: 31px;
  margin-left: 30px;
  background: url('~@/assets/img/arrow.png') no-repeat;
  background-size: contain;
}
.search-text,
.search-arrow,
.search-calendar {
  display: inline-block;
  vertical-align: middle;
}
.search-calendar {
  width: 38px;
  height: 40px;
  margin-left: 16px;
  background: url('~@/assets/img/calendar.png') no-repeat;
  background-size: contain;
}
.calendar-text {
  color: #999;
}
.search-button {
  margin: 135px 30px;
}
/* 时间样式 */
.group-item{
  position: relative;
  padding: 0 30px;
}
/* .picker-btn{
  position: absolute;
  width: 100%;
  //height: 50px;
  top:-5px;
  //right:35px;
  overflow: hidden;
  opacity: 0;
} */
</style>
