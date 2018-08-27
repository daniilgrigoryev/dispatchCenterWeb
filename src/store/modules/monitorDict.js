export default {
  state: {
    moduleName: 'monitorDict',
    bean: 'StateBean',
    routeName: 'MonitorDict',
    data: null
  },
  mutations: {
    monitorDictSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    monitorDictSetData: ({commit}, payload) => {
      commit('monitorDictSetData', payload.data);
    }
  },
  getters: {}
};
