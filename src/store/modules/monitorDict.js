export default {
  state: {
    moduleName: 'monitorDict',
    bean: 'StateBean',
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
