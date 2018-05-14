<template>
  <div id="app">
    <div class="transfer-top">
      <img src="~common/img/transfer_05.jpg" alt="">
      <span>向其他联系人转账</span>
      <i class="i-img pull-right"></i>
    </div>
    <div class="title">
      常用联系人
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'transferIndex',
    components: {

    },
    data() {
      return {

      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';
  .pull-right{
    float: right;
  }
  .pull-left{
    float: left;
  }
  .clearfix{
    display: block;
    clear:both;
  }
  .i-img{
    background-image: url('~common/img/arrow.png');
    background-size: 20px 30px;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    display: block;
    margin-top: 20px;
  }
  .transfer-top{
    padding: 37px 35px;
    font-size: 30px;
    color: #333;
    img{
      width: 42px;
      height: 46px;
      margin-right: 35px;
      margin-top: 10px;
      float: left;
    }
    span{
      line-height: 70px;
    }

  }
  .title{
    background: #efeff4;
    font-size: 30px;
    padding: 35px 35px 16px;
  }
</style>
