<template>
  <div class="list-wrap">
    <section>
      <ul>
        <li class="reason-dis test" style="position: relative" @click="getReason">
          <span class="reason-text-distance">拒绝原因</span>
          <input ref="reason" type="text" placeholder="请选择拒绝原因" v-model="options.account"/>
          <span class="i-img arrow-position"></span>
          <span class="pencil pencil-position" @click.stop="edit"></span>
        </li>
        <li class="reason-dis password" style="position: relative">
          <span class="reason-text-distance">授权密码</span>
          <input type="text" placeholder="请输入授权密码" v-model="options.password">
          <!--<span class="i-img arrow-position-special"></span>-->
        </li>
      </ul>
    </section>
    <footer>
      <div>
        <button class="button-size btn"  @click="submitMessage">提交</button>
      </div>
    </footer>
    <u-select
      ref="select"
      :slots="slots"
      :on-change="onReasonSelectChange">
    </u-select>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Toast } from 'mint-ui';
  import uSelect from 'common/components/u-select';
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options: {
          account: '',
          password: ''
        },
        slots: [
          {
            values: ['无', '不满意', '不符合要求']
          }
        ]
      };
    },
    components: {
      uSelect
    },
    mounted() {
    },
    methods: {
      getReason() {
        this.$refs.select.open();
      },
      onReasonSelectChange(v) {
        this.options.account = v[0];
      },
      edit() {
        this.$refs.reason.focus();
      },
      submitMessage() {
        if (this.options.account && this.options.password) {
        } else {
          if (!this.options.account) {
            Toast('请选择拒绝原因');
          } else {
            Toast('请输入授权密码');
          }
        }
      }
    }
  };

</script>

<style lang="less" scoped>
  .list-wrap{
    span{
      color: #333333;
    }
    .test{
      margin-top:40px;
    }
    .pencil{
      background-image: url('~common/img/pencil.png');
      background-size: 25px 35px;
      background-repeat: no-repeat;
      width: 25px;
      height: 35px;
      display: inline-block;
      margin-left:34px;
    }
    .pencil-position{
      position: absolute;
      top:0px;
      right:12px;
    }
    .arrow-position{
      position: absolute;
      top:0px;
      right:70px;
    }
    .arrow-position-special{
      position: absolute;
      right:12px;
      top:0px;
    }
    .i-img{
      background-image: url('~common/img/arrow.png');
      background-size: 15px 30px;
      background-repeat: no-repeat;
      width: 15px;
      height: 30px;
      display: inline-block;
    }
    .reason-dis{
      padding-bottom: 24px;
      border-bottom: 1px solid #DDDDDD;
      margin-bottom: 67px;
    }
    .reason-text-distance{
      margin-right:80px;
    }
    .password{
      margin-bottom: 140px;
    }
    .button-size{
      height: 100px;
      background-color: #E14535;
      border-radius: 10px;
    }
  }
</style>
