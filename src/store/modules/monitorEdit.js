export default {
  state: {
    moduleName: 'monitorEdit',
    bean: 'MonitorEdit',
    routeName: 'MonitorEdit',
    data: null
  },
  mutations: {
    monitorEditSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    monitorEditSetData: ({commit}, payload) => {
      commit('monitorEditSetData', payload.data);
    }
  },
  getters: {}
};
