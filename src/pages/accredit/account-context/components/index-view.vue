<template>
  <div id="app">
    <child></child>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import child from './child';

  export default {
    name: 'accountContext',
    components: {
      child
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

</style>
