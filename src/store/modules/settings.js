import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
//  showFooter, footerTxt,
const { tagsView, fixedHeader, sidebarLogo, caseNumber } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: false,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  // showFooter: showFooter,
  // footerTxt: footerTxt,
  caseNumber: caseNumber
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    console.log(state, key, value, '11');
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      console.log(state, key, value, '22');
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

