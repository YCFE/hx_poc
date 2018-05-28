<template>
  <div id="app" v-if="params">
    <div class="detail-title">
        <div class="detail-top">
          <p class="money">{{ params.money }}</p>
          <p>交易金额</p>
        </div>
        <div class="detail-bottom clearfix">
          <div class="pull-left">
              理财产品认购
          </div>
          <div class="pull-right">
              提交人：{{params.submitter}}
          </div>
        </div>
    </div>
    <div class="detail-content">
      <ul>
        <li>
          <label for="">产品名称</label>
          <input type="text" readonly value="" v-model="params.name">
        </li>
        <li>
          <label for="">产品类型</label>
          <input type="text" readonly value="" v-model="params.type">
        </li>
        <li>
          <label for="">预期年化收益率</label>
          <input type="text" readonly value="" v-model="params.return">
        </li>
        <li>
          <label for="">期限</label>
          <input type="text" readonly value="" v-model="params.timeLimit">
        </li>
        <li>
          <label for="">到期日</label>
          <input type="text" readonly value="" v-model="params.deadline">
        </li>
        <li>
          <label for="">指令状态</label>
          <input type="text" readonly value="" v-model="params.state">
        </li>
        <li>
          <label for="">提交时间</label>
          <input type="text" readonly value="" v-model="params.time">
        </li>
        <li>
          <label for="">更多详情</label>
          <i class="i-img-toggle-arrow pull-right" @click="toggleArrow" :class="{transformArrow:transformArrow}"></i>
        </li>
        <div v-show="isShowSection" class="li-div">
          <p>募集日期：{{params.recruitmentDate}}</p>
          <p>起息日：{{params.valueDate}}</p>
          <p>剩余额度：{{params.remaining}}</p>
          <p>认购账号：{{params.subscriptionNo}}</p>
          <p>产品代码：{{params.productNo}}</p>
          <p>流水号：{{params.number}}</p>
          <p>投资及收益币种：{{params.currency}}</p>
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
  import request from '@/libs/request';
  import { getParam } from '@/libs/utils';
  import mixins from '@/libs/mixins';

  export default {
    name: 'accreditFinancialDetail',
    mixins: [mixins],
    data() {
      return {
        transformArrow:false,
        isShowSection:true,
        options:null,
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
        request('client.accrdeit.getFinancialDetailData', r => {
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
      padding: 0 124px;
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
