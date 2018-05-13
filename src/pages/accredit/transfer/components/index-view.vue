<template>
  <div id="app">
    <div class="search">
      <div class="searchbar">
          <i class="mintui mintui-search"></i>
          <input type="search" placeholder="请输入搜索内容">
      </div>
    </div>
    <div class="transfer">
      <div class="transfer-heard">
          <i @click="checkImg" :class="{checked: checked}"></i>
          转账汇款
          <img class="pull-right toggle-arrow" src="~common/img/arrow.png" alt="">
          <!-- <i class="pull-right" @click="toggleArrow" :class="{toggleArrowDown: checked}"></i> -->
      </div>
      <section class="clearfix" v-for="(item, index) in options" :key="index">
        <i class="pull-left i-center" :class="{checked: checked}"></i>
        <div class="pull-left">
          <p class="font-light-gray">企业银行测试1</p>
          <p>尾号0001 <span class="font-red">贷款</span></p>
          <p class="font-light-gray">2018-05-11</p>
        </div>
        <div class="pull-right block-right">
          <p>预约转账</p>
          <p><a href="" class="font-red">全额预约 <i class="font-red checked"></i></a></p>
          <p class="font-light-gray">提交人：测试三</p>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex';
/*   import { Search } from 'mint-ui';

  Vue.component(Search.name, Search); */

  export default {
    name: 'accreditTransfer',
    components: {

    },
    data() {
      return {
        search:'',
        checked:true,
      }
    },
    methods: {
      checkImg(){
        console.log('111');
      },
    },
    mounted() {

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
  .checked{
    background-image: url('~common/img/arrow.png');
    background-size: 20px 30px;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    display: inline-block;
  }
  .toggle-arrow{
    width: 30px;
    height: 30px;
  }
  .search{
    background: @light-gray;
    padding: 20px 30px;
    .searchbar{
      background: #fff;
      padding: 10px 20px;
      border-radius:4px;
    }
  }
  .transfer{
    color: @black-gray;
    padding: 0 30px;
    .transfer-heard{
      padding: 20px 0;
      border-bottom: 1px solid @light-gray;
    }
    section{
      padding: 30px 0;
      border-bottom: 1px solid @light-gray;
      p{
        line-height: 50px;
      }
      .block-right{
        padding-right: 60px;
        text-align: right;
        i{
          margin-right: -60px;
          margin-top: 10px;
          display: block;
          float: right;
        }
      }
      .i-center{
        margin-top: 55px;
        margin-right: 5px;
      }
    }
  }
</style>
