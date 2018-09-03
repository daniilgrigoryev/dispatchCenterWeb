export default {
  state: {
    moduleName: 'monitorReestr',
    cid: null,
    bean: 'MonitorReestr',
    routeName: 'MonitorReestr',
    data: null,
    command: null
  },
  mutations: {
    monitorReestrSetCid(state, cid) {
      state.cid = cid;
    },
    monitorReestrSetData(state, data) {
      state.data = data;
    },
    monitorReestrSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    monitorReestrSetCid: ({commit}, payload) => {
      commit('monitorReestrSetCid', payload);
    },
    monitorReestrSetData: ({commit}, payload) => {
      commit('monitorReestrSetData', payload.data);
    },
    monitorReestrSetCommand: ({commit}, payload) => {
      commit('monitorReestrSetCommand', payload.data);
    }
  },
  getters: {
    monitorReestrGetCommand: state => () => state.command
  }
};
