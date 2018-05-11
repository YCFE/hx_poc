<template>
  <div id="app">
    <child></child>
  </div>
</template>

<style lang="less" scoped>
  @import '~common/css/base.less';

</style>

<script>
  import { mapState } from 'vuex';
  import child from './child';

  export default {
    name: 'checkLists',
    components: {
      child
    },
    data() {
      return {
        name: 'checkLists'
      };
    },
    mounted() {

    }
  };
</script>
