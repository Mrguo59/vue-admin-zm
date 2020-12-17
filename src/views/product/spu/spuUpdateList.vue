<template>
  <el-card style="margin-top: 20px">
    <!--
      表单校验：
        1. 整体form表单中
        2. 通过prop属性来定义表单项名称
        3. 定义表单校验规则
          - 在data中定义rules
          - 绑定给form
        4. 校验表单
          - 给form绑定ref
          - this.$refs.spuForm.validate 校验表单
     -->
    <el-form ref="form" label-width="80px" :model="spu" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
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
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          v-model="spu.description"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImageList">
        <el-upload
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :file-list="spuImageListType"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
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
            v-for="base in filterSaleAttrList"
            :key="base.id"
            :label="base.name"
            :value="`${base.id}-${base.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!spu.saleAttrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
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
                closable
                v-for="(spuSaleValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleValue.id"
                @close="delSaleAttrValue(row, index)"
                >{{ spuSaleValue.saleAttrValueName }}</el-tag
              >
              <el-input
                ref="input"
                v-if="row.edit"
                v-model="saleAttrValueName"
                @blur="addSaleAttrValue(row)"
                @keyup.enter.native="addSaleAttrValue(row)"
                size="mini"
                style="width: 80px"
              ></el-input>
              <el-button v-else size="mini" @click="switchInput(row)"
                >+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`您确定要删除${row.saleAttrName}`"
                @onConfirm="delSaleAttr($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="preAttr('form')">保存</el-button>
        <el-button @click="$emit('switchModUpdate')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="PreviewImg" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState } from "vuex";

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
      saleAttrValueName: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [{ required: true, message: "至少选择一个品牌" }],
        description: [{ required: true, message: "请输入SPU描述" }],
        spuImageList: [{ validator: this.checkImg, required: true }],
        saleAttrId: [{ validator: this.checkSaleAttr, required: true }],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
    //处理上传图片的函数,格式化图片数据
    spuImageListType() {
      return this.spuImageList.map((img) => {
        return {
          //解决上传图片闪烁
          // 一上来请求回来的数据只有id
          // 新添加的数据不能设置id（由后台设置），所以写的是uid
          // 总之，id一定由后台服务器生成
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
    //处理销售属性及列表的函数，让销售属性遍历过滤后的数组
    filterSaleAttrList() {
      return this.BaseAttrList.filter((base) => {
        //indexOf只适用于数组中是基本类型
        //find适用于数组中是引用类型
        // 找到了返回{}  没有找到返回undefined,对象转换为布尔值就是true，undefined为false
        //如果SpuSaleAttrList中存在BaseAttrList里的属性，就需要过滤掉，找到了说明存在，因为要过滤掉，所以要取反
        return !this.SpuSaleAttrList.find(
          (sale) => sale.baseSaleAttrId === base.id
        );
      });
    },
  },

  methods: {
    // 添加销售属性
    addSaleAttr() {
      // 选中的销售属性id
      const { saleAttrId } = this.spu;
      //第一种方式
      // 去所有销售属性列表找到某个销售属性
      // const base = this.BaseAttrList.find((base) => base.id === saleAttrId);
      // this.SpuSaleAttrList.push({
      //   baseSaleAttrId: base.id,// 所有销售属性id
      //   saleAttrName: base.name,// 所有销售属性名称
      //   spuId: this.spu.id,
      //   spuSaleAttrValueList: [],// 销售属性值列表
      // });

      //第二种方式
      const [baseSaleAttrId, saleAttrName] = saleAttrId.split("-");
      // console.log(baseSaleAttrId, saleAttrName);
      // 将销售属性添加到商品中
      this.SpuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId, // 所有销售属性id
        saleAttrName, // 所有销售属性名称
        spuId: this.spu.id,
        spuSaleAttrValueList: [], // 销售属性值列表
      });
      // 清空选中的销售属性id
      this.spu.saleAttrId = "";
    },

    //当失去焦点或者按下enter键触发
    // 添加销售属性值
    addSaleAttrValue(row) {
      if (this.saleAttrValueName) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueName,
          spuId: row.spuId,
        });
        // 添加完成数据清空
        this.saleAttrValueName = "";
      }
      //当失去焦点或者按下enter键，切换为button
      row.edit = false;
    },

    //点击的时候把button切换成input输入框，并获取焦点
    switchInput(row) {
      //给attrValueList添加一个新属性edit
      this.$set(row, "edit", true);
      //获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    //删除属性值
    delSaleAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },

    //删除销售属性
    delSaleAttr(index) {
      this.SpuSaleAttrList.splice(index, 1);
    },

    //点击保存的时候触发，收集数据，发送请求
    preAttr(form) {
      this.$refs[form].validate(async (valid) => {
        //需要的数据
        //"category3Id": 0,
        //"description": "string",
        //"id": 0,
        //"spuImageList": [],
        // spuName:[],
        // spuSaleAttrList:[],
        // "tmId": 0

        if (valid) {
          // 收集数据
          const spu = {
            ...this.spu,
            category3Id: this.category.category3Id,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.SpuSaleAttrList,
          };
          // console.log(spu);

          let result;
          // 发送请求
          //判断是修改还是添加
          if (this.spu.id) {
            result = await this.$API.spu.updateSpuInfo(spu);
          } else {
            result = await this.$API.spu.saveSpuInfo(spu);
          }

          if (result.code === 200) {
            this.$message.success(`${this.spu.id ? "修改" : "添加"}数据成功`);
            // 切换回SpushowList组件
            this.$emit("switchModUpdate");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },

    //校验图片
    checkImg(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        // 校验通过
        callback();
        return;
      }
      // 校验失败
      callback(new Error("请上传至少一张图片"));
    },

    //校验销售属性
    checkSaleAttr(rule, value, callback) {
      // 判断至少选择一个销售属性
      if (this.SpuSaleAttrList.length === 0) {
        callback(new Error("请选择至少一个销售属性"));
      }
      // 判断销售属性中至少添加一个销售属性值
      const isNo = this.SpuSaleAttrList.some(
        (SpuSale) => SpuSale.spuSaleAttrValueList.length === 0
      );

      if (isNo) {
        callback(new Error("销售属性至少选择一个销售属性值"));
        return;
      }
      callback();
    },

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
        this.spuImageList = result.data;
        // this.spuImageList = result.data.map((img) => {
        //   return {
        //     id: img.id,
        //     name: img.imgName,
        //     url: img.imgUrl,
        //   };
        // });
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
    // 处理图片删除
    handleRemove(file, fileList) {
      //file就是当前点击了删除的图片
      // fileList就是删除以后剩下的图片
      // console.log(file, fileList);
      this.spuImageList = this.spuImageList.filter(
        (img) => img.imgUrl !== file.url
      );
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      // res.data 图片地址
      // console.log(this.spu.id);
      this.spuImageList.push({
        //解决上传图片闪烁
        uid: file.uid,
        spuId: this.spu.id,
        imgName: file.name, // 文件名称
        imgUrl: res.data, // 图片地址
      }); // 图片地址
    },
    //上次图片之前触发的回调
    beforeAvatarUpload(file) {
      // console.log(file);
      const ImgType = ["image/jpeg", "image/jpg", "image/png"];
      // 检测文件类型
      const fitImgType = ImgType.indexOf(file.type) > -1;
      // 检测文件大小
      const fitSize = file.size / 1024 < 50;

      if (!fitImgType) {
        this.$message.error("上传头像图片只能是jpeg/png/jpg格式!");
      }
      if (!fitSize) {
        this.$message.error("上传头像图片大小不能超过50kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return fitImgType && fitSize;
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
    this.getBaseSaleAttrList();
    // 判断是添加还是修改
    // 如果是修改就会有id，添加没有id
    if (this.spu.id) {
      this.getSpuImageList();
      this.getSpuSaleAttrList();
    }
  },
};
</script>

<style lang="less" scoped>
</style>
