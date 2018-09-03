export default {
  state: {
    moduleName: 'alarmViewData',
    cid: null,
    bean: 'AlarmView',
    routeName: 'AlarmViewData',
    data: null,
    command: null
  },
  mutations: {
    alarmViewDataSetCid(state, cid) {
      state.cid = cid;
    },
    alarmViewDataSetData(state, data) {
      state.data = data;
    },
    alarmViewDataSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    alarmViewDataSetCid: ({commit}, payload) => {
      commit('alarmViewDataSetCid', payload);
    },
    alarmViewDataSetData: ({commit}, payload) => {
      commit('alarmViewDataSetData', payload.data);
    },
    alarmViewDataSetCommand: ({commit}, payload) => {
      commit('alarmViewDataSetCommand', payload.data);
    }
  },
  getters: {
    alarmViewDataGetCommand: state => () => state.command
  }
};
