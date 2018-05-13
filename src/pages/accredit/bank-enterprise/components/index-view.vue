<template>
  <div id="app">
    <div class="transfer">
      <div class="transfer-heard clearfix">
          <div class="pull-left checkbox-div">
            <input @click="allCheckbox" type="checkbox" name="" id="allCheck" class="ui-checkbox">
            <label class="" for="allCheck">银企对账</label>
          </div>
          <i class="i-img-toggle-arrow pull-right" @click="toggleArrow" :class="{transformArrow:transformArrow}"></i>
      </div>
      <section class="clearfix" v-for="(item, index) in options" :key="index" v-show="isShowSection">
        <div class="pull-left">
          <input @click="totalNumber"   v-model="checkedArr" type="checkbox" :value="index" name="" class="ui-checkbox" :id="index">
          <label class="normal" :for="index">i</label>
        </div>
        <div class="pull-left">
          <p>账单编号：{{ item.number }}</p>
          <p class="font-light-gray"><span>{{item.time}}</span> <span class="padding-span">提交人：{{item.submitter}}</span></p>
        </div>
        <div class="pull-right block-right">
          <a href="" class="font-red"><i class="font-red i-img-red-arrow"></i></a>
        </div>
      </section>
    </div>
    <div class="footer">
      <p>已选择 <span class="font-red"> {{ total }} </span> 笔</p>
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

  export default {
    name: 'accreditBankEnterprise',
    components: {

    },
    data() {
      return {
        search:'',
        transformArrow:false,
        isShowSection:true,
        total: 0,
        checkedArr:[],
        options:[]
      }
    },
    methods: {
      totalNumber(){
        let checked = event.currentTarget.checked;
        if(event.currentTarget.checked){
          this.total++;
        }else{
          this.total--;
        }

      },
      allCheckbox(){
        var _this = this;
        if (!event.currentTarget.checked) {
          this.checkedArr = [];
        } else {
          _this.checkedArr = [];
          _this.options.forEach(function(item, i) {
            _this.checkedArr.push(i);
          });
          this.total = _this.options.length;
        }
      },
      toggleArrow(){
        this.transformArrow = !this.transformArrow;
        if(!this.transformArrow){
          this.isShowSection = true;
        }else{
          this.isShowSection = false;
        }
      },
      getData() {
        request('client.accredit.getBankData', r => {
          this.options = r.data;
        });
      },
      refuse(){
        if(this.total == 0){
          MessageBox('提示', '请选择银企对账项目');
          return false;
        }else{
          AlipayJSBridge.call('pushWindow', {
            url: 'refusal-reason.html'
          });
        }
      },
      agree(){
        if(this.total == 0){
          MessageBox('提示', '请选择银企对账项目');
          return false;
        }else{
          AlipayJSBridge.call('pushWindow', {
            url: 'code.html'
          });
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
  .padding-span{
    padding-left: 200px;
  }
  .footer{
    text-align: center;
    font-size: 28px;
    color: @font-gray;
    margin-top: 50px;
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
  .font-red{
    color:@red;
  }
  .font-light-gray{
    color: @font-gray;
  }
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
  .i-img-red-arrow{
    background-image: url('~common/img/transfer_12.jpg');
    background-size: 20px 30px;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    display: inline-block;
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
  .toggle-arrow{
    width: 30px;
    height: 30px;
  }
  .transfer{
    color: @black-gray;
    padding: 0 30px;
    .transfer-heard{
      padding: 30px 0;
      border-bottom: 1px solid @light-gray;
    }
    section{
      padding: 35px 0 40px;
      border-bottom: 1px solid @light-gray;
      p{
        line-height: 50px;
      }
      .block-right{
        padding-right: 60px;
        text-align: right;
        i{
          margin-right: -60px;
          margin-top: 30px;
          display: block;
          float: right;
        }
      }
      .i-center{
        margin-top: 55px;
        margin-right: 5px;
      }
    }
    label.normal {
      color: #fff;
      margin-top: 25px;
    }
  }
  .ui-checkbox {
    display: none;
  }

  .ui-checkbox+label {
    padding: 5px 0 5px 58px;
    background: url('~common/img/transfer_03.jpg') no-repeat;
    display: inline-block;
    background-size: 38px 38px ;
    font-size: 30px;
  }
  .ui-checkbox:checked + label {
    background: url('~common/img/transfer_10.jpg')  no-repeat;
    background-size: 38px 38px ;
  }
</style>
