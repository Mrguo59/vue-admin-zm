<template>
  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    :with-header="false"
    size="50%"
  >
    <div class="drawer-row">
      <h3>名称</h3>
      <span>{{ DrawerList.skuName }}</span>
    </div>
    <div class="drawer-row">
      <h3>描述</h3>
      <span>{{ DrawerList.skuDesc }}</span>
    </div>
    <div class="drawer-row">
      <h3>价格</h3>
      <span>{{ DrawerList.price }}</span>
    </div>
    <div class="drawer-row">
      <h3>平台属性</h3>
      <el-tag
        type="success"
        v-for="skuAttr in DrawerList.skuAttrValueList"
        :key="skuAttr.id"
        >{{ skuAttr.attrId + "-" + skuAttr.valueId }}</el-tag
      >
    </div>
    <div class="drawer-row">
      <h3>销售属性</h3>
      <el-tag
        type="success"
        v-for="skuSale in DrawerList.skuSaleAttrValueList"
        :key="skuSale.id"
        >{{ skuSale.id + "-" + skuSale.saleAttrValueId }}</el-tag
      >
    </div>
    <div class="drawer-row">
      <h3 class="drawer-img">商品图片</h3>
      <el-carousel trigger="click" height="400px" class="sku-carousel">
        <el-carousel-item
          v-for="skuImage in DrawerList.skuImageList"
          :key="skuImage.id"
        >
          <img :src="skuImage.imgUrl" :alt="skuImage.imgUrl" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "SkuDrawer",
  data() {
    return {
      drawer: false,
      DrawerList: {},
    };
  },
  methods: {
    async DrawerPage(skuId) {
      this.drawer = true;
      const result = await this.$API.sku.drawerSkuList(skuId);
      //   console.log(result);
      if (result.code === 200) {
        this.DrawerList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.$bus.$on("DrawerPage", this.DrawerPage);
  },
};
</script>

<style lang="sass" scoped>
>>>.drawer-row
    display: flex
    align-items: center
    margin-left: 60px
>>>h3
    width: 100px
    margin-right: 15px
    text-align: right
>>>.drawer-img
    position: relative
    top: -190px
>>>.sku-carousel
    width: 400px
    border: 1px solid #ccc
    img
        width: 400px
        height: 400px
    /deep/ .el-carousel__indicator
        button
            background-color: hotpink

        &.is-active
        button
            background-color: skyblue
</style>
