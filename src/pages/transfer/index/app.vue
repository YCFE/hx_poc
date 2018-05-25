<template>
  <div id="app" v-if="options">
    <div class="transfer-top" @click="open('do-transfer.html')">
      <img src="~@/assets/img/transfer_05.jpg" alt="">
      <span>向其他联系人转账</span>
      <i class="i-img pull-right"></i>
    </div>
    <div class="title">
      常用联系人
    </div>
    <div class="contacts">
      <ul>
        <li v-for="(item,index) in options" :key="index" @click="open('do-transfer.html', index+1)">
          <img v-if="index === 0" src="~@/assets/img/transfer_07.jpg" alt="">
          <img v-else src="~@/assets/img/hxlogo.jpg" alt="">
          <div class="div-inline">
            <p >{{ item.name }}</p>
            <p class="font-gray">{{ item.bank }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;尾号{{ item.id }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="all-contacts" @click="open('all-contacts.html')">
      全部联系人
      <i class="i-img pull-right"></i>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import request from '@/libs/request';
  import mixins from '@/libs/mixins';

  export default {
    name: 'transferIndex',
    mixins: [mixins],
    data() {
      return {
        options: null
      }
    },
    methods:{
      getData(){
        request('client.transfer.getTransferContactsData', r => {
          this.options = r.data;
        });
      },
      open(url, bank) {
        AlipayJSBridge.call('pushWindow', {
          url: `${url}?bank=${bank}`
        });
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<style lang="less">
  @import '~@/assets/less/base.less';

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
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .div-inline{
    display: inline-block;
  }
  .i-img{
    background-image: url('~@/assets/img/arrow.png');
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
  .font-gray{
    color: #999;
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
    }
  }
  .all-contacts{
    margin: 0 35px;
    padding: 54px 0 34px;
    font-size: 30px;
    color: #333;
    border-bottom: 1px solid #ddd;
    i{
      margin-top: 0;
    }
  }
</style>
