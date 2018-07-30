export default {
  state: {
    moduleName: 'monitorViewData',
    cid: null,
    bean: 'MonitorView',
    routeName: 'MonitorViewData',
    data: null
  },
  mutations: {
    monitorViewDataSetCid(state, cid) {
      state.cid = cid;
    },
    monitorViewDataSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    monitorViewDataSetCid: ({commit}, payload) => {
      commit('monitorViewDataSetCid', payload);
    },
    monitorViewDataSetData: ({commit}, payload) => {
      commit('monitorViewDataSetData', payload.data);
    }
  },
  getters: {}
};
