// @/utils/dict/dict-mixin.js
// 数据字典
import { dict } from '@/utils/dict/video';

// 读取方法
export default {
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
