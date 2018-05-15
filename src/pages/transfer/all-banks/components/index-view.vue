<template>
  <div id="app">
    <div class="gray">
      常用收款银行
    </div>
    <ul class="contacts">
      <li v-for="(item,index) in options" :key="index" @click="detail">
        <!-- <i  class="pull-left head-img"></i> -->
        <img class="pull-left" src="~common/img/transfer_07.jpg" alt="">
        <div class="div-inline">
          <p >{{item.name}}</p>
          <i class="i-img pull-right"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'transferAllBanks',
    components: {

    },
    data() {
      return {
        options:[
          {
            name:'企业银行'
          },
          {
            name:'企业银行1'
          }
        ]
      }
    },
    methods:{
      detail(){
        /* AlipayJSBridge.call('pushWindow', {
          url: 'refusal-reason.html'
        }); */
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';
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
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .i-img{
    background-image: url('~common/img/arrow.png');
    background-size: 20px 30px;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    display: block;
    margin-top: -50px;
  }
  .gray{
    background: #efeff4;
    padding: 20px 30px;
  }
  .contacts{
    li{
      border-bottom: 1px solid #ddd;
      padding: 30px 35px;
      font-size: 32px;
      color: #333;
      line-height: 50px;
      img{
        width: 76px;
        height: 76px;
        margin-right: 35px;
      }
      p{
        line-height: 76px;
      }
    }
  }
</style>
