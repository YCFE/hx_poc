<template>
  <div id="app">
    <div class="search-box">
      <div class="search-item clearfix" @click="openStartPicker">
        <span class="search-label fl">执行日期：</span>
        <span class="search-value fr">
          <span class="search-text calendar-text">{{search.startDate}}</span>
          <i class="search-calendar"></i>
        </span>
      </div>
      <div class="search-item clearfix" @click="openTypeSelect">
        <span class="search-label fl">执行时间：</span>
        <span class="search-value fr">
          <span class="search-text">{{search.type}}</span>
          <i class="search-arrow"></i>
        </span>
      </div>
      <div class="search-button">
        <button class="btn btn-primary" @click="doOrder">预约</button>
      </div>
      <div class="tip">
        <h4>温馨提示</h4>
        <p>1、受支付系统奴性时间制约，50万元以上跨行预约业务，请选择工作日。</p>
        <p>2、杭外预约，按实际转账的手续费标砖收取手术费。</p>
        <p>3、为您提供未来90天内江要办理的转账预约业务。</p>
        <p>4、预约交易，上午执行时间为9:00；下午执行时间为14:00。</p>
        <p>5、如果未执行前您想要执行后查看预警预约的转账指令，请通过“指令查询”进行操作。</p>
      </div>
    </div>

    <u-select
      ref="type"
      :slots="slots"
      :on-change="onTypeSelectChange">
    </u-select>

    <mt-datetime-picker
      ref="startPicker"
      type="date"
      :start-date="startDate"
      v-model="value.endDate"
      @confirm="setStartDate">
    </mt-datetime-picker>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import uSelect from 'common/components/u-select';
import request from 'common/js/request';
import { MessageBox } from 'mint-ui';

const startDate = new Date();

startDate.setMonth(startDate.getMonth() - 6);

export default {
  name: 'transferAppointmentTransfer',
  components: {
    uSelect
  },
  data() {
    return {
      search: {
        type: '',
        startDate: ''
      },
      value: {
        startDate: ''
      },
      slots: [{
        values: ['上午', '下午']
      }],
      startDate: startDate,
    };
  },
  methods: {
    openTypeSelect() {
      this.$refs.type.open();
    },
    onTypeSelectChange(v) {
      this.search.type = v[0];
    },
    openStartPicker() {
      this.$refs.startPicker.open();
    },
    doSearch() {
      AlipayJSBridge.call('pushWindow', {
        url: 'check-lists.html'
      });
    },
    setStartDate(date) {
      const { search, value } = this;
      value.startDate = date;
      search.startDate = `${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日`;
    },
    doOrder(){
      if(this.search.type == null){
        MessageBox('提示', '请选择执行时间');
          return false;
      }else{
        /* AlipayJSBridge.call('pushWindow', {
          url: 'code.html'
        }); */
      }
    }
  },
  mounted() {
    const date = new Date();
    this.setStartDate(date);
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
  width: 31px;
  height: 15px;
  margin-left: 30px;
  background: url('~common/img/transfer_06.jpg') no-repeat;
  background-size: contain;
  transform:rotate(180deg);
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
  background: url('~common/img/calendar.png') no-repeat;
  background-size: contain;
}
.calendar-text {
  color: #999;
}
.search-button {
  margin-top: 50px;
}
.tip{
  margin-top: 40px;
  color: #999;
  font-size: 26px;
  line-height: 40px;
  h4{
    font-size: 30px;
    color: #e14636;
    font-weight: normal;
    margin-bottom: 10px;
  }
}
</style>
