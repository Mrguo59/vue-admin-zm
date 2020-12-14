<template>
  <el-card style="margin-top: 20px">
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="desc">
        <el-input
          type="textarea"
          v-model="spu.description"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="desc">
        <el-upload
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <!--
        prop="saleAttrId" 将来作为表单校验
       -->
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="`还有${filterSaleAttrList.length}项未选择`"
          v-model="spu.saleAttrId"
        >
          <el-option
            v-for="fs in filterSaleAttrList"
            :key="fs.id"
            :label="fs.name"
            :value="fs.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-table :data="SpuSaleAttrList" border style="width: 100%">
          <el-table-column
            prop="date"
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <!-- 结构出来一个row，row就是当前行数据 -->
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="spuSaleValue in row.spuSaleAttrValueList"
                :key="spuSaleValue.id"
                >{{ spuSaleValue.saleAttrValueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="PreviewImg" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    row: Object,
  },
  data() {
    return {
      spu: this.row,
      trademarkList: [], // 所有品牌数据
      spuImageList: [], // 所有图片列表
      visible: false, // 图片对话框显示&隐藏
      PreviewImg: "", // 图片地址
      BaseAttrList: [], // 所有销售属性列表
      SpuSaleAttrList: [], // 当前SPU销售属性列表
    };
  },
  computed: {
    filterSaleAttrList() {
      return this.BaseAttrList.filter((base) => {
        //indexOf只适用于数组中是基本类型
        //find适用于数组中是引用类型
        // 找到了返回{}  没有找到返回undefined,对象转换为布尔值就是true，undefined为false
        //如果SpuSaleAttrList中存在BaseAttrList里的属性，就需要过滤掉，找到了说明存在，因为要过滤掉，所以要取反
        return !this.SpuSaleAttrList.find((sale) => {
          return sale.baseSaleAttrId === base.id;
        });
      });
    },
  },
  methods: {
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取品牌数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        // 处理数据
        // [{imgName: '', imgUrl: ''}]
        // 要转换为[{name: '', url: ''}]
        this.spuImageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    // 处理图片预览
    handlePreview(file) {
      // console.log(file);
      this.PreviewImg = file.url;
      this.visible = true;
    },
    // 处理删除
    handleRemove(file, fileList) {
      //file就是当前点击了删除的图片
      // fileList就是删除以后剩下的图片
      // console.log(file, fileList);
      this.spuImageList = this.spuImageList.filter((img) => img.id !== file.id);
    },
    // 获取所有销售属性列表
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取销售数据成功");
        this.BaseAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取SPU销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取销售列表数据成功");
        this.SpuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getBaseSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
