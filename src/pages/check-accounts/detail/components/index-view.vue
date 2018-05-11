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
    name: 'accountDetail',
    components: {
      child
    },
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

</style>
