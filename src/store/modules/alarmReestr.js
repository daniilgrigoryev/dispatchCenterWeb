export default {
  state: {
    moduleName: 'alarmReestr',
    cid: null,
    bean: 'AlarmReestr',
    routeName: 'AlarmReestr',
    data: null,
    command: null
  },
  mutations: {
    alarmReestrSetCid(state, cid) {
      state.cid = cid;
    },
    alarmReestrSetData(state, data) {
      state.data = data;
    },
    alarmReestrSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    alarmReestrSetCid: ({commit}, payload) => {
      commit('alarmReestrSetCid', payload);
    },
    alarmReestrSetData: ({commit}, payload) => {
      commit('alarmReestrSetData', payload.data);
    },
    alarmReestrSetCommand: ({commit}, payload) => {
      commit('alarmReestrSetCommand', payload.data);
    }
  },
  getters: {
    alarmReestrGetCommand: state => () => state.command
  }
};
