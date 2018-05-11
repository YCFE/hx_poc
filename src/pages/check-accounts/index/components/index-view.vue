<template>
  <div id="app">
    <!-- Hello {{name}} -->
    <child></child>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import child from './child';

  export default {
    name: 'accountIndex',
    components: {
      child
    },
    data() {
      return {
        name: '111',
      }
    },
    mounted() {

    }
  }

</script>

<style lang="less">
  @import '~common/css/base.less';

</style>
