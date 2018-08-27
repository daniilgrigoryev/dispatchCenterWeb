export default {
  state: {
    moduleName: 'monitorReestr',
    bean: 'MonitorReestr',
    routeName: 'MonitorReestr',
    data: null
  },
  mutations: {
    monitorReestrSetData(state, data) {
      state.data = data;
    }
  },
  actions: {
    monitorReestrSetData: ({commit}, payload) => {
      commit('monitorReestrSetData', payload.data);
    }
  },
  getters: {}
};
