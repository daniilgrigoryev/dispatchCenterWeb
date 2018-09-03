export default {
  state: {
    moduleName: 'monitorEdit',
    cid: null,
    bean: 'MonitorEdit',
    routeName: 'MonitorEdit',
    data: null
  },
  mutations: {
    monitorEditSetCid(state, cid) {
      state.cid = cid;
    },
    monitorEditSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    monitorEditSetCid: ({commit}, payload) => {
      commit('monitorEditSetCid', payload);
    },
    monitorEditSetData: ({commit}, payload) => {
      commit('monitorEditSetData', payload.data);
    }
  },
  getters: {}
};
