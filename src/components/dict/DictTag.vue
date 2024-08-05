<!-- 进一步封装 el-tag 简化使用方法 -->
<template>
  <!--
  原始方法
  <template slot-scope="scope">
      <el-tag v-if="scope.row.marketType == 1">经销型</el-tag>
      <el-tag v-else-if="scope.row.marketType == 2" type="info">行业型</el-tag>
      <el-tag v-else-if="scope.row.marketType == 0" type="danger">无效(未知类型)</el-tag>
    </template>
    进阶方法1
  <el-tag :type="getSupportRedirectTag(scope.row.supportRedirect)"> {{ getSupportRedirectName(scope.row.supportRedirect) }} </el-tag>
  进阶方法2
  <el-tag :type="getDictTag('supportRedirect', scope.row.supportRedirect)">
      {{ getDictValue('supportRedirect', scope.row.supportRedirect) }}
  </el-tag>
  -->
  <!-- 进阶方法3 封装组件 -->
  <el-tag :type="getDictTag(dictKey, value)">
    {{ getDictValue(dictKey, value) }}
  </el-tag>
</template>

<script>
// import dictMixin from '@/mixins/dict-mixin';
// 数据字典
import { dict } from '@/utils/dict/video';
export default {
  name: 'DictTag',
  // mixins: [dictMixin],
  props: {
    dictKey: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      dict,
    };
  },
  methods: {
    getDictValue(dictKey, value) {
      const dict = this.dict[dictKey];
      return dict[value]?.text || '未知';
    },
    getDictTag(dictKey, value) {
      const dict = this.dict[dictKey];
      const item = dict[value];
      if (item?.tagType !== undefined) {
        return item.tagType; // 如果tagType有明确指定，则直接返回
      }
      switch (value) {
        case 0:
          return 'danger';
        case 1:
          return '';
        case 2:
          return 'info';
        default:
          return 'warning'; // 默认类型
      }
    },
  },
};
</script>
