<template>
  <div id="app">
    <!-- Hello {{name}} -->
    <child></child>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import child from './child';
  import mixins from 'common/js/mixins';

  export default {
    name: 'accountDetail',
    components: {
      child
    },
    mixins,
    data() {
      return {
        name: 'accountDetail',
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';
  body{
    background: #efeff4;
  }
</style>
