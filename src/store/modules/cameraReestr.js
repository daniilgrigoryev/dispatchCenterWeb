export default {
  state: {
    moduleName: 'cameraReestr',
    cid: null,
    bean: 'CameraReestr',
    routeName: 'CameraReestr',
    data: null,
    command: null
  },
  mutations: {
    cameraReestrSetCid(state, cid) {
      state.cid = cid;
    },
    cameraReestrSetData(state, data) {
      state.data = data;
    },
    cameraReestrSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    cameraReestrSetCid: ({commit}, payload) => {
      commit('cameraReestrSetCid', payload);
    },
    cameraReestrSetData: ({commit}, payload) => {
      commit('cameraReestrSetData', payload.data);
    },
    cameraReestrSetCommand: ({commit}, payload) => {
      commit('cameraReestrSetCommand', payload.data);
    }
  },
  getters: {
    cameraReestrGetCommand: state => () => {
      return state.command;
    },
    cameraReestrGetData: state => () => {
      return state.data;
    }
  }
};
