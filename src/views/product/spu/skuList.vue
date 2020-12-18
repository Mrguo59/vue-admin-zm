<template>
  <el-card style="margin-top: 20px">
    <el-form ref="form" :model="sku" :rules="rules" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU价格"
          class="skulist-input-number"
          v-model="sku.price"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="SKU重量"
          class="skulist-input-number"
          v-model="sku.weight"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="SPU规格描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          class="skulist-select"
          v-for="(attr, index) in tableAttrList"
          :key="attr.id"
        >
          <el-form-item :label="attr.attrName">
            <!-- v-model绑定的是tableAttrList的下标 ,每个下标代表tableAttrList里的一个对象-->
            <!--  -->
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${value.id}-${attr.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="skulist-select"
          v-for="(sale, index) in SpuSaleAttrList"
          :key="sale.id"
        >
          <el-form-item :label="sale.saleAttrName">
            <!-- v-model绑定的是SpuSaleAttrList的下标 ,每个下标代表SpuSaleAttrList里的一个对象-->
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="attrValue in sale.spuSaleAttrValueList"
                :key="attrValue.id"
                :label="attrValue.saleAttrValueName"
                :value="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          border
          ref="multipleTable"
          :data="spuImageList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <!--reserve-selection保留原来的数据，需要一个row-key属性  -->
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img
                :src="row.imgUrl"
                :alt="row.imgName"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                v-if="!row.isDefault"
                type="primary"
                size="mini"
                @click="setDefault(row.id)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="preAttr">保存</el-button>
        <el-button @click="$emit('switchModSpu')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SkuList",
  props: {
    skuItem: Object,
  },
  data() {
    return {
      spu: this.skuItem, // spu数据
      sku: {
        // sku数据
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      spuImageList: [], // 图片列表
      SpuSaleAttrList: [], // 销售属性数据
      tableAttrList: [], // 平台属性数据
      // 表单验证规则
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        weight: [{ required: true, message: "请输入重量", trigger: "change" }],
        skuDesc: [
          { required: true, message: "请输入规格描述", trigger: "change" },
        ],
        skuAttrValueList: {
          required: true,
          validator: this.skuAttrValueListValidator,
        },
        skuSaleAttrValueList: {
          required: true,
          validator: this.skuSaleAttrValueListValidator,
        },
        skuImageList: {
          required: true,
          validator: this.skuImageListValidator,
        },
      }, // 表单验证规则
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //移除表单项校验结果
    clearValidate(prop) {
      this.$refs.form.clearValidate(prop);
    },

    //点击保存的时候触发
    preAttr() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          /*
            {
              "category3Id": 0,
              "id": 0, // 由后台生成
              "isSale": 0,
              "price": 0,
              "skuAttrValueList": [
                {
                  "attrId": 0,
                  "id": 0,
                  "skuId": 0,
                  "valueId": 0
                }
              ],
              "skuDefaultImg": "string",
              "skuDesc": "string",
              "skuImageList": [
                {
                  "id": 0,
                  "imgName": "string",
                  "imgUrl": "string",
                  "isDefault": "string",
                  "skuId": 0,
                  "spuImgId": 0 // id
                }
              ],
              "skuName": "string",
              "skuSaleAttrValueList": [
                {
                  "id": 0,
                  "saleAttrValueId": 0,
                  "skuId": 0,
                  "spuId": 0
                }
              ],
              "spuId": 0,
              "tmId": 0,
              "weight": "string"
            }
          */
          const { category3Id, id: supId, tmId } = this.spu;
          //处理skuAttrValueList数据
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [valueId, attrId] = attr.split("-");
            return {
              valueId,
              attrId,
            };
          });

          //处理skuSaleAttrValueList数据
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                supId,
              };
            }
          );

          //获取skuDefaultImg数据
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;

          const result = await this.$API.sku.saveSkuInfo({
            ...this.sku,
            category3Id,
            supId,
            tmId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          });
          if (result.code === 200) {
            this.$message.success("保存sku成功");
            this.$emit("switchModSpu");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },

    //校验平台属性数据
    skuAttrValueListValidator(rules, value, callback) {
      const {
        tableAttrList,
        sku: { skuAttrValueList },
      } = this;
      //如果tableAttrList和skuAttrValueList的长度不相等，说明没全部选中，因为每选中一个数据就会往skuAttrValueList里添加一个，或者判断skuAttrValueList里是否有undefined，some方法会遍历，返回为true的，然后就不再遍历了
      if (
        tableAttrList.length !== skuAttrValueList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error('"请选中所有的平台属性"'));
        return;
      }

      callback();
    },
    //校验销售属性数据
    skuSaleAttrValueListValidator(rules, value, callback) {
      const {
        SpuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      //如果SpuSaleAttrList和skuSaleAttrValueList的长度不相等，说明没全部选中，因为每选中一个数据就会往skuSaleAttrValueList里添加一个，或者判断skuSaleAttrValueList里是否有undefined，some方法会遍历，返回为true的，然后就不再遍历了
      if (
        SpuSaleAttrList.length !== skuSaleAttrValueList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请选中所有的销售属性"));
        return;
      }
      callback();
    },
    //校验图片数据
    skuImageListValidator(rules, vaule, callback) {
      const {
        sku: { skuImageList },
      } = this;

      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片"));
        return;
      }
      //如果isDefault为true，说明选择了默认图片，some方法就返回true，就不会再遍历了，就不会进入判断，如果isDefault为false，说明没选择默认图片，取反，会进入判断，提示校验结果，some方法会继续遍历
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请设置一张默认图片~"));
        return;
      }

      callback();
    },
    //设置默认图片
    setDefault(id) {
      //通过id判断当前点击的是哪个图片的设为默认按钮，给点击了默认按钮的图片添加一个isDefault属性为true，没有点击的全部设置为false，然后更新data里的数据
      this.spuImageList = this.spuImageList.map((img) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
      //通过id判断当前点击的是哪个图片的设为默认按钮，给点击了默认按钮的图片添加一个isDefault属性为true，没有点击的全部设置为false，然后更新data里的数据
      //skuImageList是从spuImageList里拿的，所以不光要更新spuImageList的数据，也要更新skuImageList里的数据，使其同步
      this.sku.skuImageList = this.sku.skuImageList.map((img) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    //获取当前选中的图片数据
    handleSelectionChange(val) {
      this.sku.skuImageList = val;
    },

    // 获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.spuImageList = result.data;
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

    //请求平台属性列表数据函数
    async attrList() {
      //当点击三级分类的时候，要把属性列表数据清空
      // this.tableAttrList = [];
      //当点击三级分类的时候，去请求属性列表数据
      const result = await this.$API.attrs.attrInfoList(this.category);
      if (result.code === 200) {
        this.tableAttrList = result.data;
      }
    },
  },
  mounted() {
    this.attrList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  },
};
</script>

<style lang="sass" scoped>
>>>.skulist-input-number
  width: 1050px
>>>.el-input-number .el-input__inner
  text-align: left
>>>.skulist-select
  display: inline-block
  width: 30%
  margin-right: 30px
  margin-bottom: 10px
</style>
