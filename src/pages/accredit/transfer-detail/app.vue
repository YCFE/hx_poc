<template>
  <div id="app" v-if="options && params">
    <div class="detail-title">
        <div class="detail-top">
          <p class="money">{{ params.money }}</p>
          <p>交易金额</p>
        </div>
        <div class="detail-bottom clearfix">
          <div class="pull-left">
              {{params.transfer}}
          </div>
          <div class="pull-right">
              提交人：{{params.submitter}}
          </div>
        </div>
    </div>
    <div class="detail-content">
      <ul>
        <li>
          <label for="">指令状态</label>
          <input type="text" readonly value="" v-model="params.order">
        </li>
        <li>
          <label for="">提交时间</label>
          <input type="text" readonly value="" v-model="params.time">
        </li>
        <li>
          <label for="">手续费</label>
          <input type="text" readonly value="" v-model="params.fees">
        </li>
        <li>
          <label for="">收款方详情({{params.beneficiaryName}})</label>
          <i class="i-img-toggle-arrow pull-right" @click="toggleArrow" :class="{transformArrow:transformArrow}"></i>
        </li>
        <div v-show="isShowSection" class="li-div">
            <p>收款方：{{params.beneficiaryName}}</p>
            <p>收款账号：{{params.beneficiaryId}}</p>
            <p>收款方开户行：{{params.beneficiaryBank}}</p>
          </div>
        <li>
          <label for="">更多详情</label>
          <i class="i-img-toggle-arrow pull-right" @click="toggleArrow1" :class="{transformArrow:transformArrow1}"></i>
        </li>
        <div v-show="isShowSection1" class="li-div">
          <p>付款方：{{params.payerName}}</p>
          <p>付款账号：{{params.payerId}}</p>
          <p>付款用途：{{params.payerUse}}</p>
          <p>执行时间：{{params.payerTime}}</p>
          <p>交易流水号：{{params.payerNo}}</p>
        </div>
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
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import request from '@/libs/request';
  import mixins from '@/libs/mixins';
  import { getParam } from '@/libs/utils';

  export default {
    name: 'accreditTransferDetail',
    components: {

    },
    mixins: [mixins],
    data() {
      return {
        transformArrow:false,
        isShowSection:true,
        transformArrow1:false,
        isShowSection1:true,
        options: null,
        params: JSON.parse(getParam('r'))
      }
    },
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
        request('client.accrdeit.getTransferDetailData', r => {
          this.options = r.data;
        });
      },
      toggleArrow(){
        this.transformArrow = !this.transformArrow;
        if(!this.transformArrow){
          this.isShowSection = true;
        }else{
          this.isShowSection = false;
        }
      },
      toggleArrow1(){
        this.transformArrow1 = !this.transformArrow1;
        if(!this.transformArrow1){
          this.isShowSection1 = true;
        }else{
          this.isShowSection1 = false;
        }
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<style lang="less">
  @import '~@/assets/less/base.less';

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
  .i-img-toggle-arrow{
    background-image: url('~@/assets/img/transfer_06.jpg');
    background-size: 31px 15px;
    background-repeat: no-repeat;
    width: 31px;
    height: 15px;
    display: inline-block;
    margin-top: 10px;
  }
  .transformArrow{
    transform:rotate(180deg);
  }
  .footer{
    text-align: center;
    font-size: 28px;
    color: @font-gray;
    margin-top: 50px;
    /* position: absolute;
    bottom: 0; */
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
      font-size: 26px;
      line-height: 50px;
      .money{
        font-size: 40px;
      }
    }
    .detail-bottom{
      padding: 28px 0;
    }
  }
  .detail-content{
    //margin: 0 30px;
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
  }
  .gray-line{
    height: 20px;
    background: #efeff4;
  }
  .li-div{
    padding:  40px 30px;
    background: #efeff4;
    color: #999;
    line-height: 46px;
  }
</style>
