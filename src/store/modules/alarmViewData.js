export default {
  state: {
    moduleName: 'alarmViewData',
    cid: null,
    bean: 'AlarmView',
    routeName: 'AlarmViewData',
    data: null
  },
  mutations: {
    alarmViewDataSetCid(state, cid) {
      state.cid = cid;
    },
    alarmViewDataSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    alarmViewDataSetCid: ({commit}, payload) => {
      commit('alarmViewDataSetCid', payload);
    },
    alarmViewDataSetData: ({commit}, payload) => {
      commit('alarmViewDataSetData', payload.data);
    }
  },
  getters: {}
};
