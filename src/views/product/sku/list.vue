<template>
  <div>
    <SkuAdmin @ejectDrawer="ejectDrawer" />
    <SkuDrawer/>
  </div>
</template>

<script>
import SkuAdmin from "./skuAdmin";
import SkuDrawer from "./skuDrawer";

export default {
  name: "SKuList",
  data() {
    return {
      isDrawer: false,
    };
  },
  methods: {
    ejectDrawer(skuId) {
      this.$nextTick(() => {
        this.$bus.$emit("DrawerPage",skuId);
      });
    },
  },
  components: {
    SkuAdmin,
    SkuDrawer,
  },
};
</script>
<style lang="sass" scoped>
</style>