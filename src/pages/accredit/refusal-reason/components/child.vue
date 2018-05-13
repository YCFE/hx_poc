<template>
  <div class="list-wrap">
    <section>
      <ul>
        <li class="reason-dis test" style="position: relative">
          <span class="reason-text-distance">拒绝原因</span>
          <input v-show="this.showChoose" ref="reason" type="text" placeholder="请选择拒绝原因" v-model="options.account"/>
          <input v-show="!this.showChoose" ref="reason" type="text" placeholder="请输入拒绝原因" v-model="options.account"/>
          <span class="i-img arrow-position" @click="getReason"></span>
          <span class="pencil pencil-position" @click.stop="edit"></span>
        </li>
        <li class="reason-dis password" style="position: relative">
          <span class="reason-text-distance">授权密码</span>
          <input type="password" placeholder="请输入授权密码" v-model="options.password">
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
  import request from 'common/js/request';
  import { mapState } from 'vuex';
  import { Toast } from 'mint-ui';
  import uSelect from 'common/components/u-select';
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        showChoose: true,
        options: {
          account: '',
          password: ''
        },
        slots: [
          {
            values: ''
          }
        ]
      };
    },
    components: {
      uSelect
    },
    mounted() {
      this.getReasonInfo();
    },
    methods: {
      getReasonInfo() {
        request('client.accredit.getReason', r => {
          this.slots[0].values = r.data;
        });
      },
      getReason() {
        this.showChoose = true;
        this.$refs.select.open();
      },
      onReasonSelectChange(v) {
        this.options.account = v[0];
      },
      edit() {
        this.showChoose = !this.showChoose;
        this.$refs.reason.focus();
        this.options.account = '';
      },
      checkInfo() {
        if (!this.options.account) {
          if (this.showChoose) {
            alert('请选择拒绝原因');
            return false;
          } else {
            alert('请输入拒绝原因');
            return false;
          }
          // Toast('请选择拒绝原因');
        }
        if (!this.options.password) {
          alert('请输入授权密码');
          return false;
          // Toast('请输入授权密码');
        }
        if (this.options.password.length < 6) {
          alert('密码格式不正确，至少需要6位');
          return false;
        }
        return true;
      },
      submitMessage() {
        if (!this.checkInfo()) {
          return;
        }
        request('client.accredit.getReason', r => {
          AlipayJSBridge.call('pushWindow', {
            url: 'result.html'
          });
        });
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
      background-position: center;
      width: 50px;
      height: 50px;
      display: inline-block;
      margin-left:34px;
    }
    .pencil-position{
      position: absolute;
      top:-5px;
      right:-13px;
    }
    .arrow-position{
      position: absolute;
      top:-5px;
      right:35px;
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
      background-position: center;
      width: 50px;
      height: 50px;
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
