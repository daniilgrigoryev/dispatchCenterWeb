export default {
  state: {
    moduleName: 'monitorViewData',
    cid: null,
    bean: 'MonitorView',
    routeName: 'MonitorViewData',
    data: null,
    command: null
  },

  mutations: {
    monitorViewDataSetCid(state, cid) {
      state.cid = cid;
    },
    monitorViewDataSetData(state, data) {
      state.data = data;
    },
    monitorViewDataSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    monitorViewDataSetCid: ({commit}, payload) => {
      commit('monitorViewDataSetCid', payload);
    },
    monitorViewDataSetData: ({commit}, payload) => {
      commit('monitorViewDataSetData', payload.data);
    },
    monitorViewDataSetCommand: ({commit}, payload) => {
      commit('monitorViewDataSetCommand', payload.data);
    }
  },
  getters: {
    monitorViewDataGetCommand: state => () => state.command
  }
};
