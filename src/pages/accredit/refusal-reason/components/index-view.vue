<template>
  <div id="app">
    <child></child>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import mixins from 'common/js/mixins';
  import child from './child';

  export default {
    name: 'refusalReason',
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
