export default {
  state: {
    moduleName: 'objectViewData',
    cid: null,
    bean: 'ObjectView',
    routeName: 'ObjectViewData',
    data: null,
    command: null
  },
  mutations: {
    objectViewDataSetCid(state, cid) {
      state.cid = cid;
    },
    objectViewDataSetData(state, data) {
      state.data = data;
    },
    objectViewDataSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    objectViewDataSetCid: ({commit}, payload) => {
      commit('objectViewDataSetCid', payload);
    },
    objectViewDataSetData: ({commit}, payload) => {
      commit('objectViewDataSetData', payload.data);
    },
    objectViewDataSetCommand: ({commit}, payload) => {
      commit('objectViewDataSetCommand', payload.data);
    }
  },
  getters: {
    objectViewDataGetCommand: state => () => {
      return state.command
    },
    objectViewDataGetData: state => () => {
      return state.data
    }
  }
};
