<template>
  <div>
    <header class="telephone-information">
      <span class="text-distance">已向尾号<span>4444</span>的绑定手机号发送验证码，请查收</span>
    </header>
    <section class="list-wrap">
      <ul>
        <li class="code-distance" style="position: relative">
          <span>验证码</span>
          <input class="input-distance" maxlength="6" type="tel" placeholder="请输入" v-model="options.number"/>
          <!--<button class="btn btn-code code-button-position">获取验证码</button>-->
          <countdown
            :second="10"
            @click.native="runTimer"
            ref="timer"></countdown>
        </li>
        <li class="password">
          <span class="">授权密码</span>
          <input class="input-password-distance" minlength="6" maxlength="20" type="text" placeholder="请输入授权密码" v-model="options.code">
        </li>
      </ul>
    </section>
    <footer class="list-wrap">
      <div class="">
        <button class="button-size btn" @click="messageSubmit">提交</button>
      </div>
    </footer>
  </div>
</template>

<script>
  import countdown from 'common/components/countdown';
  export default {
    name: 'child',
    data() {
      return {
        name: 'child',
        options: {
          number: '',
          code: ''
        }
      };
    },
    components: {
      countdown
    },
    mounted() {
      const self = this;
      setTimeout(function () {
        self.runTimer();
      }, 1000);
    },
    methods: {
      runTimer() {
        this.$refs.timer.run();
      },
      checkInfo() {
        if (!this.options.number) {
          alert('请输入短信验证码');
          return false;
        }
        if (this.options.number.length < 6) {
          alert('请输入6位短信验证码');
          return false;
        }
        if (!this.options.code) {
          alert('请输入授权密码');
          return false;
        }
        if (!this.options.code.length < 6) {
          alert('密码格式不正确，至少需要6位');
          return false;
        }
        return true;
      },
      messageSubmit() {
        this.checkInfo();
        AlipayJSBridge.call('pushWindow', {
          url: 'result.html'
        });
      }
    }
  };

</script>

<style lang="less">
  .telephone-information{
    background-color:#EFEFF4;
    height: 64px;
    line-height: 64px;
    color:#E14636;
    font-size: 23px;
  }
  .text-distance{
    margin-left: 28px;
  }
  .list-wrap{
    .btn-code{
      font-size: 25px;
      height: 64px;
      width: 170px;
    }
    .code-distance{
      margin-top: 58px;
      padding-bottom: 25px;
      border-bottom: 1px solid #DDDDDD;
      margin-bottom: 66px;
    }
    .code-button-position{
      position: absolute;
      bottom:6px;
      right:0px;
    }
    .password{
      padding-bottom: 25px;
      border-bottom: 1px solid #DDDDDD;
      margin-bottom: 140px;
    }
    .button-size{
      height: 100px;
      background-color: #E14535;
      border-radius: 10px;
    }
    .input-distance{
      margin-left: 112px;
    }
    .input-password-distance{
      margin-left: 82px;
    }
  }
</style>
