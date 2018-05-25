<template>
  <div id="app">
    <div class="search-box">
      <group>
        <popup-picker
          title="账号"
          :data="slots"
          v-model="search.account"
          @on-show="onShow"
          @on-hide="onHide"
          @on-change="onChange"
          placeholder="全部">
        </popup-picker>
        <datetime title="开始日期" :start-date="startDate" :end-date="endDate" v-model="search.startDate"></datetime>
        <datetime title="结束日期" :start-date="startDate" :end-date="endDate" v-model="search.endDate"></datetime>
      </group>
      <!-- <div class="search-item clearfix" @click="openAccountSelect">
        <span class="search-label fl">账号</span>
        <span class="search-value fr">
          <span class="search-text">{{search.account}}</span>
          <i class="search-arrow"></i>
        </span>
      </div> -->
      <!-- <div class="search-item clearfix" @click="openStartPicker">
        <span class="search-label fl">开始日期</span>
        <span class="search-value fr">
          <span class="search-text calendar-text">{{search.startDate}}</span>
          <i class="search-calendar"></i>
          <i class="search-arrow"></i>
        </span>
      </div>
      <div class="search-item clearfix" @click="openEndPicker">
        <span class="search-label fl">结束日期</span>
        <span class="search-value fr">
          <span class="search-text calendar-text">{{search.endDate}}</span>
          <i class="search-calendar"></i>
          <i class="search-arrow"></i>
        </span>
      </div> -->
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


const startDate = new Date();

startDate.setMonth(startDate.getMonth() - 6);

const date = new Date();
const startDate1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

export default {
  name: 'inputSearch',
  components: {
    PopupPicker,
    Group,
    Datetime
  },
  mixins:[mixins],
  data() {
    return {
      search: {
        account: ['全部'],
        startDate: startDate1,
        endDate: startDate1
      },
      /* value: {
        startDate: '',
        endDate: ''
      }, */
      slots: [],
      startDate: startDate,
      endDate: new Date()
    };
  },
  methods: {
    /* openAccountSelect() {
      this.$refs.select.open();
    },
    onAccountSelectChange(v) {
      this.search.account = v[0];
    },
    openStartPicker() {
      this.$refs.startPicker.open();
    },
    openEndPicker() {
      this.$refs.endPicker.open();
    },
    setStartDate(date) {
      const { search, value } = this;
      value.startDate = date;
      search.startDate = `${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日`;
    },
    setEndDate(date) {
      const { search, value } = this;
      value.endDate = date;
      search.endDate = `${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日`;
    }, */
    doSearch() {
      AlipayJSBridge.call('pushWindow', {
        url: 'input.html'
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
      console.log("this.search.startDate");
      console.log(this.search.startDate);
    }
  },
  mounted() {
    //const date = new Date();
    /* this.setStartDate(date);
    this.setEndDate(date); */
    this.getAccounts();
    this.getTime();
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
</style>
