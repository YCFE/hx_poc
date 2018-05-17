<template>
  <div class="container">
    <!-- Hello {{name}} -->
    <div class="index-list">
      <ul>
        <li>
          <div class="a" @click="inputSearch">
            <span>对账录入</span>
            <span class="pull-right"><i class="i-img"></i></span>
          </div>
        </li>
        <li>
          <div class="a" href="" @click="reconciliation">
            <span>对账授权</span>
            <span class="pull-right"><i class="i-img"></i></span>
          </div>
        </li>
        <li>
          <div class="a" @click="search">
            <span>对账查询</span>
            <span class="pull-right"><i class="i-img"></i></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'child',
    data() {
      return {
        name: 'child'
      }
    },
    mounted() {

    },
    methods:{
      inputSearch(){
        AlipayJSBridge.call('pushWindow', {
          url: 'input-search.html'
        });
      },
      reconciliation(){
        AlipayJSBridge.call('pushWindow', {
          url: 'reconciliation.html'
        });
      },
      search(){
        AlipayJSBridge.call('pushWindow', {
          url: 'search.html'
        });
      },
    }
  }

</script>

<style lang="less" scoped>
  @black-gray:#333;
  @line-gray:#ddd;
  .i-img{
    background-image: url('~common/img/arrow.png');
    background-size: 20px 30px;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    display: block;
  }
  .container{
    overflow: hidden;
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
  a{
    text-decoration: none;
  }
  .index-list{
    font-size: 30px;
    margin: 0 29px;
    .a{
      padding: 45px 0 45px;
      color: @black-gray;
      display: block;
      border-bottom: 1px solid @line-gray;
      img{
        height: 30px;
      }
    }
  }
</style>
