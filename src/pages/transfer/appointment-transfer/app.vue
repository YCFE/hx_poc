<template>
  <div id="app">
    <div class="search-box">
      <div class="search-item clearfix">
        <span class="search-label fl">执行日期：</span>
        <span class="search-value fr">
          <span class="search-text calendar-text">{{search.startDate}}</span>
          <i class="search-calendar"></i>
        </span>
        <Group class="picker-opacity">
          <Datetime v-model="search.startDate"></Datetime>
        </Group>
      </div>
      <div class="search-item clearfix">
        <span class="search-label fl">执行时间：</span>
        <span class="search-value fr">
          <span class="search-text">{{search.type}}</span>
          <i class="search-arrow"></i>
        </span>
        <Group class="picker-opacity">
          <popup-picker :data="data" @on-change="setType"></popup-picker>
        </Group>
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
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { Group, PopupPicker, Datetime } from 'vux';
import request from '@/libs/request';
import mixins from '@/libs/mixins';
import { getParam } from '@/libs/utils';

const startDate = new Date();

export default {
  name: 'transferAppointmentTransfer',
  components: {
    Group,
    PopupPicker,
    Datetime,
  },
  mixins: [mixins],
  data() {
    return {
      search: {
        type: '',
        startDate: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
      },
      value: {
        startDate: ''
      },
      data: [['上午', '下午']],
      startDate: startDate,
    };
  },
  methods: {
    setType(v) {
      console.log(v)
      this.search.type = v[0];
    },
    doSearch() {
      AlipayJSBridge.call('pushWindow', {
        url: 'check-lists.html'
      });
    },
    doOrder(){
      const r = encodeURIComponent(getParam('r'));

      if(this.search.type == ""){
        this.alert('请选择执行时间');
        return false;
      }else{
        AlipayJSBridge.call('pushWindow', {
          url: `appointment-transfer-confirm.html?r=${r}`
        });
      }
    }
  },
  mounted() {
    const date = new Date();
  }
};
</script>

<style lang="less">
@import '~@/assets/less/base.less';

.search-box {
  margin: 0 30px;
}
.search-item {
  position: relative;
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
  background: url('~@/assets/img/transfer_06.jpg') no-repeat;
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
  background: url('~@/assets/img/calendar.png') no-repeat;
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
.group-date,.group-type{
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  opacity: 0;
  overflow: hidden;
  .vux-datetime,.weui-cells,.vux-cell-box,.weui-cell{
    height: 100%;
  }
}
</style>
