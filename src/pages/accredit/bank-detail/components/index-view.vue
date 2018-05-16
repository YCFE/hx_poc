<template>
  <div id="app" v-if="params">
    <div class="detail-title">
        <div class="detail-top">
          <p>对账单编号：{{ params.number }}</p>
          <p>流水号：{{params.no}}</p>
        </div>
        <div class="detail-bottom clearfix">
          <div class="pull-left">
              银企对账
          </div>
          <div class="pull-right">
              提交人：{{params.submitter}}
          </div>
        </div>
    </div>
    <div class="detail-content">
      <ul>
        <li class="clearfix">
          <label for="">账户名称</label>
          <div class="input-div">
            {{params.name}}
          </div>
        </li>
        <li>
          <label for="">存款类型</label>
          <input type="text" readonly value="" v-model="params.type">
        </li>
        <li>
          <label for="">余额</label>
          <input type="text" readonly value="" v-model="params.balance">
        </li>
        <li>
          <label for="">余额日期</label>
          <input type="text" readonly value="" v-model="params.time">
        </li>
        <li>
          <label for="">对账结果</label>
          <input type="text" readonly value="" v-model="params.result">
        </li>
      </ul>
    </div>
    <div class="gray-line"></div>
    <div class="footer">
      <div class="button-inline">
        <button class="btn btn-primary" @click="refuse">拒绝</button>
        <button class="btn btn-primary" @click="agree">同意</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { MessageBox } from 'mint-ui';
  import request from 'common/js/request';
  import mixins from 'common/js/mixins';
  import utils from 'common/js/utils';

  const { getParam } = utils;

  export default {
    name: 'accreditBankDetail',
    components: {

    },
    data() {
      return {
        options: null,
        params: JSON.parse(getParam('r'))
      }
    },
    mixins,
    methods: {
      refuse(){
        AlipayJSBridge.call('pushWindow', {
          url: 'refusal-reason.html'
        });
      },
      agree(){
        AlipayJSBridge.call('pushWindow', {
          url: 'code.html'
        });
      },
      getData() {
        request('client.accrdeit.getBankDetailData', r => {
          this.options = r.data;
        });
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';
  @light-gray:#efeff4;
  @black-gray:#333;
  @line-gray:#ddd;
  @font-gray:#A1A1A1;
  @red:#e14636;
  .clearfix{
    display: block;
    clear:both;
  }
  .pull-right{
    float: right;
  }
  .pull-left{
    float: left;
  }
  .footer{
    text-align: center;
    font-size: 28px;
    color: @font-gray;
    //margin-top: 170px;
    position: absolute;
    bottom: 0;
  }
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .button-inline{
    margin: 5px;
    .btn{
      display: inline-block;
      width: auto;
      padding: 33px 124px;
      margin: 23px;
    }
  }
  .detail-title{
    background: @red;
    color: #fff;
    font-size: 30px;
    padding: 0 30px;
    .detail-top{
      text-align: center;
      padding: 40px 0;
      border-bottom: 1px solid #f0a39b;
      font-size: 34px;
      line-height: 50px;
    }
    .detail-bottom{
      padding: 28px 0;
    }
  }
  .detail-content{
    margin: 0 30px;
    font-size: 30px;
    li{
      padding: 50px 0 20px;
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
  }
  .gray-line{
    height: 20px;
    background: #efeff4;
  }
</style>
