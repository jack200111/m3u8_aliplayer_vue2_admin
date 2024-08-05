// 数据字典
export const dict = {
  // 在线设备列表----
  // 是否支持重定向
  supportRedirect: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
  // 注册类型
  marketType: {
    0: { text: '无效(未知类型)', tagType: 'danger' },
    1: { text: '经销型', tagType: '' },
    2: { text: '行业型', tagType: 'info' },
  },

  // 设备信息-------
  // 语言对讲的音频格式
  audioEncType: {
    0: { text: 'G.722', tagType: '' },
    1: { text: 'G.711U', tagType: '' },
    2: { text: 'G.711A', tagType: '' },
    3: { text: 'G.726', tagType: '' },
    4: { text: 'AAC', tagType: '' },
    5: { text: 'MP2L2', tagType: '' },
    // 6: { text: '未知' },
  },
  // 智能模式
  smartType: {
    0: { text: '智能(默认)', tagType: '' },
    1: { text: '专业智能', tagType: 'warning' },
  },
  // 是否显示通道名称
  isShowChanName: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
  // 是否显示日期信息
  isShowOSD: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
  // OSD格式
  osdType: {
    0: { text: 'XXXX-XX-XX(年-月-日)', tagType: '' },
    1: { text: 'XX-XX-XXXX(月-日-年)', tagType: '' },
    2: { text: 'XXXX年XX月 XX 日', tagType: '' },
    3: { text: 'XX月XX日XXXX 年', tagType: '' },
    4: { text: 'XX-XX-XXXX(日-月-年)', tagType: '' },
    5: { text: 'XX日XX月XXXX 年', tagType: '' },
    // 6: { text: '未知' },
  },
  // OSD属性
  osdAtrib: {
    0: { text: '不显示 OSD', tagType: '' },
    1: { text: '透明,闪烁', tagType: '' },
    2: { text: '透明,不闪烁', tagType: '' },
    3: { text: '闪烁,不透明', tagType: '' },
    4: { text: '不透明，不闪烁', tagType: '' },
    // 5: { text: '未知' },
  },
  // 是否显示星期
  isShowWeek: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
  // 设备基本信息----
  // 是否支持循环录像
  recycleRecord: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
  // 是否支持主口缩放
  majorScale: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
  // 是否支持辅口缩放
  minorScale: {
    0: { text: '否', tagType: 'danger' },
    1: { text: '是', tagType: '' },
  },
};
