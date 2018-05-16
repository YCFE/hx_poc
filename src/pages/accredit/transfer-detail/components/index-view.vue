<template>
  <div id="app" v-if="options">
    <div class="detail-title">
        <div class="detail-top">
          <p>{{ options.money }}</p>
          <p>交易金额</p>
        </div>
        <div class="detail-bottom clearfix">
          <div class="pull-left">
              预约转账
          </div>
          <div class="pull-right">
              提交人：{{options.submitter}}
          </div>
        </div>
    </div>
    <div class="detail-content">
      <ul>
        <li>
          <label for="">指令状态</label>
          <input type="text" readonly value="" v-model="options.order">
        </li>
        <li>
          <label for="">提交时间</label>
          <input type="text" readonly value="" v-model="options.time">
        </li>
        <li>
          <label for="">手续费</label>
          <input type="text" readonly value="" v-model="options.fees">
        </li>
        <li>
          <label for="">收款方详情({{options.beneficiaryName}})</label>
          <i class="i-img-toggle-arrow pull-right" @click="toggleArrow" :class="{transformArrow:transformArrow}"></i>
        </li>
        <div v-show="isShowSection" class="li-div">
            <p>收款方：{{options.beneficiaryName}}</p>
            <p>收款账号：{{options.beneficiaryId}}</p>
            <p>收款方开户行：{{options.beneficiaryBank}}</p>
          </div>
        <li>
          <label for="">更多详情</label>
          <i class="i-img-toggle-arrow pull-right" @click="toggleArrow1" :class="{transformArrow:transformArrow1}"></i>
        </li>
        <div v-show="isShowSection1" class="li-div">
          <p>付款方：{{options.payerName}}</p>
          <p>付款账号：{{options.payerId}}</p>
          <p>付款用途：{{options.payerUse}}</p>
          <p>执行时间：{{options.payerTime}}</p>
          <p>交易流水号：{{options.payerNo}}</p>
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
  import { mapState } from 'vuex';
  import { MessageBox } from 'mint-ui';
  import request from 'common/js/request';
  import mixins from 'common/js/mixins';

  export default {
    name: 'accreditTransferDetail',
    components: {

    },
    mixins,
    data() {
      return {
        transformArrow:false,
        isShowSection:true,
        transformArrow1:false,
        isShowSection1:true,
        options:{
          money:'',
          submitter:'',
          order:'',
          time:'',
          fees:'',
          beneficiaryName:'',
          beneficiaryId:'',
          beneficiaryBank:'',
          payerName:'',
          payerId:'',
          payerUse:'',
          payerTime:'',
          payerNo:'',
        }
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
  .i-img-toggle-arrow{
    background-image: url('~common/img/transfer_06.jpg');
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
      font-size: 34px;
      line-height: 50px;
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
