<template>
  <div class="list-wrap">
    <section>
      <ul>
        <li class="reason-dis test" style="position: relative">
          <span class="reason-text-distance">拒绝原因</span>
          <input ref="reason" type="text" placeholder="请输入拒绝原因" v-model="options.account"/>
          <span class="i-img arrow-position"></span>
          <span class="pencil pencil-position" @click.stop="edit"></span>
          <Group class="picker-btn">
            <popup-picker :data="data" @on-change="onPickerChange"></popup-picker>
          </Group>
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
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Group, PopupPicker } from 'vux';
  import request from '@/libs/request';
  import mixins from '@/libs/mixins';

  export default {
    name: 'resusalReason',
    data() {
      return {
        showChoose: false,
        options: {
          account: '',
          password: ''
        },
        data: []
      };
    },
    mixins: [mixins],
    components: {
      PopupPicker,
      Group
    },
    mounted() {
      this.getReasonInfo();
    },
    methods: {
      getReasonInfo() {
        request('client.accredit.getReason', r => {
          this.data = [r.data];
        });
      },
      onPickerChange(v) {
        this.options.account = v[0];
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
            this.alert('请选择拒绝原因');
            return false;
          } else {
            this.alert('请输入拒绝原因');
            return false;
          }
        }
        if (!this.options.password) {
          this.alert('请输入授权密码');
          return false;
        }
        if (this.options.password.length < 6) {
          this.alert('密码格式不正确，至少需要6位');
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
            url: 'result.html?reuslt=fail'
          });
        });
      }
    }
  };

</script>

<style lang="less">
  @import '~@/assets/less/base.less';

  .list-wrap{
    span{
      color: #333333;
    }
    .test{
      margin-top:40px;
    }
    .pencil{
      background-image: url('~@/assets/img/pencil.png');
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
      background-image: url('~@/assets/img/arrow.png');
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
  .picker-btn{
    position: absolute;
    width: 50px;
    height: 50px;
    top:-5px;
    right:35px;
    overflow: hidden;
    opacity: 0;
  }
</style>
