<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <SkuList v-if="isShowSku" :skuItem="skuItem" @switchModSpu="switchModSpu" />
    <div v-else>
      <Category :disabled="!isShowSpu" />
      <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
      <SpuShowList
        v-if="isShowSpu"
        @switchModShow="switchModShow"
        @switchModSku="switchModSku"
      />
      <SpuUpdateList v-else :row="row" @switchModUpdate="switchModUpdate" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowSpu: true,
      row: {},
      isShowSku: false,
      spuItem: {},
    };
  },
  methods: {
    switchModSpu() {
      this.isShowSku = false;
      // this.$nextTick(() => {
      //   this.$bus.$emit("attrList", { category3Id });
      // });
    },

    switchModSku(skuItem) {
      this.isShowSku = true;
      this.skuItem = { ...skuItem };
    },

    switchModShow(row) {
      //控制SpuShowList组件和SpuUpdateList组件显示隐藏的变量
      this.isShowSpu = false;
      //从SpuShowList组件传过来数据，展开，目的是得到一份新数据
      this.row = { ...row };
    },

    switchModUpdate(category3Id) {
      //控制SpuShowList组件和SpuUpdateList组件显示隐藏的变量
      this.isShowSpu = true;
      // // 等SpuShowList组件加载完成，在触发事件
      // this.$nextTick(() => {
      //   this.$bus.$emit("attrList", { category3Id });
      // });
    },
  },
  //组件卸载之前清除掉vuex的数据
  beforeDestroy() {
    this.$store.commit("category/RESET_CATEGORY_ID");
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>
