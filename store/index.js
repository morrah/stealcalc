import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      mob_selected: null
    }),
    mutations: {
      set_mob (state, mob) {
        state.mob_selected = mob;
      },
      set_drop (state, item) {
        state.drop_selected = item;
      }
    }
  })
}

export default createStore