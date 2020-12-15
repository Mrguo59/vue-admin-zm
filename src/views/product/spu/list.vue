<template>
  <div>
    <!--
      @change 当三级分类修改的时候触发。得到所有分类id
      @clearList 当1级分类和2级分类触发的时候触发，清空列表
      :disabled 决定select是否可以使用
     -->
    <Category />
    <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
    <SpuShowList v-if="isShowSpu" @switchModShow="switchModShow" />
    <SpuUpdateList v-else :row="row" @switchModUpdate="switchModUpdate" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowSpu: true,
      row: {},
    };
  },
  methods: {
    switchModShow(row) {
      //控制SpuShowList组件和SpuUpdateList组件显示隐藏的变量
      this.isShowSpu = false;
      //从SpuShowList组件传过来数据，展开，目的是得到一份新数据
      this.row = { ...row };
    },

    switchModUpdate(category3Id) {
      //控制SpuShowList组件和SpuUpdateList组件显示隐藏的变量
      this.isShowSpu = true;
      // 等SpuShowList组件加载完成，在触发事件
      this.$nextTick(() => {
        this.$bus.$emit("attrList", { category3Id });
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
