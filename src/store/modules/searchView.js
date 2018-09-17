export default {
  state: {
    moduleName: 'searchView',
    cid: null,
    bean: 'SearchView',
    routeName: 'SearchView',
    data: null,
    command: null
  },
  mutations: {
    searchViewSetCid(state, cid) {
      state.cid = cid;
    },
    searchViewSetData(state, data) {
      state.data = data;
    },
    searchViewSetCommand(state, command) {
      state.command = command;
    }
  },
  actions: {
    searchViewSetCid: ({commit}, payload) => {
      commit('searchViewSetCid', payload);
    },
    searchViewSetData: ({commit}, payload) => {
      commit('searchViewSetData', payload.data);
    },
    searchViewSetCommand: ({commit}, payload) => {
      commit('searchViewSetCommand', payload.data);
    }
  },
  getters: {
    searchViewGetCommand: state => () => state.command
  }
};
