<template>
  <div id="app">
    <child></child>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import child from './child';
  import mixins from 'common/js/mixins';

  export default {
    name: 'transferCode',
    components: {
      child
    },
    mixins,
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
