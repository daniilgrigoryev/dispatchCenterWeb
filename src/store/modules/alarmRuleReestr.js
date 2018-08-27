export default {
  state: {
    moduleName: 'alarmRuleReestr',
    bean: 'AlarmRuleReestr',
    routeName: 'AlarmRuleReestr',
    data: null
  },
  mutations: {
    alarmRuleReestrSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    alarmRuleReestrSetData: ({commit}, payload) => {
      commit('alarmRuleReestrSetData', payload.data);
    }
  },
  getters: {}
};
