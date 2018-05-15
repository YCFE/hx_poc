<template>
  <div id="app" v-if="options">
    <div class="search">
      <div class="searchbar">
          <i class="mintui mintui-search"></i>
          <input v-model="search" type="search" placeholder="请输入搜索内容" @change="searchData">
      </div>
    </div>
    <ul class="contacts">
      <li v-for="(item,index) in options" :key="index" @click="detail">
        <img class="pull-left" v-if="index === 0" src="~common/img/transfer_07.jpg" alt="">
        <img class="pull-left" v-else src="~common/img/hxlogo.jpg" alt="">
        <div class="div-inline" @click="open(index)">
          <p >{{item.name}}</p>
          <p class="font-gray">{{item.bank}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;尾号{{item.id}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import request from 'common/js/request';
  import utils from 'common/js/utils';

  const { getParam } = utils;

  export default {
    name: 'transferAllContacts',
    components: {

    },
    data() {
      return {
        search:'',
        options:null,
        from: getParam('from')
      }
    },
    methods:{
      detail(){
        /* AlipayJSBridge.call('pushWindow', {
          url: 'refusal-reason.html'
        }); */
      },
      getDate(){
        request('client.transfer.getTransferAllContactsData', r => {
          this.options = r.data;
        });
      },
      searchData(){
        request('client.transfer.getTransferAllContactsData', r => {
          this.options = r.data;
        });
      },
      open(index) {
        if(this.from === 'transfer') {
          AlipayJSBridge.call('popWindow', {
            url: 'do-transfer.html',
            data: {
              bank: `${index+1}`
            }
          });
        }else {
          AlipayJSBridge.call('pushWindow', {
            url: `do-transfer.html?bank=${index+1}`
          });
        }
      }
    },
    mounted() {
      this.getDate();
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
  .search{
    background: #ddd;
    padding: 20px 30px;
    .searchbar{
      background: #fff;
      padding: 10px 20px;
      border-radius:4px;
      input{
        width: 93%;
      }
    }
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
</style>
