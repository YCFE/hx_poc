<template>
  <div id="app">
    <div class="search-box">
      <div class="search-item clearfix" @click="openAccountSelect">
        <span class="search-label fl">账号</span>
        <span class="search-value fr">
          <span class="search-text">{{search.account}}</span>
          <i class="search-arrow"></i>
        </span>
      </div>
      <div class="search-item clearfix" @click="openStartPicker">
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
      </div>
      <div class="search-button">
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>
    </div>

    <u-select
      ref="select"
      :slots="slots"
      :on-change="onAccountSelectChange">
    </u-select>

    <mt-datetime-picker
      ref="startPicker"
      type="date"
      :start-date="startDate"
      :end-date="endDate"
      v-model="value.endDate"
      @confirm="setStartDate">
    </mt-datetime-picker>

    <mt-datetime-picker
      ref="endPicker"
      type="date"
      :start-date="startDate"
      :end-date="endDate"
      v-model="value.startDate"
      @confirm="setEndDate">
    </mt-datetime-picker>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import uSelect from 'common/components/u-select';

const startDate = new Date();

startDate.setMonth(startDate.getMonth() - 6);

export default {
  name: 'inputSearch',
  components: {
    uSelect
  },
  data() {
    return {
      search: {
        account: '全部',
        type: '全部',
        startDate: '',
        endDate: ''
      },
      value: {
        startDate: '',
        endDate: ''
      },
      slots: [
        {
          values: ['全部', '6226****3381', '6226****8624', '6226****4675']
        }
      ],
      startDate: startDate,
      endDate: new Date()
    };
  },
  methods: {
    openAccountSelect() {
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
    },
    doSearch() {
      AlipayJSBridge.call('pushWindow', {
        url: 'input.html'
      });
    }
  },
  mounted() {
    const date = new Date();
    this.setStartDate(date);
    this.setEndDate(date);
  }
};
</script>

<style lang="less">
@import '~common/css/base.less';

.search-box {
  margin: 0 30px;
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
  background: url(../imgs/arrow.png) no-repeat;
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
  background: url(../imgs/calendar.png) no-repeat;
  background-size: contain;
}
.calendar-text {
  color: #999;
}
.search-button {
  margin-top: 136px;
}
</style>
