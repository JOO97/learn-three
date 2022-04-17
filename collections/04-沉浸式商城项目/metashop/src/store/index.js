import { createStore } from "vuex";
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
      isFullscreen: false,
      buycarts: [],
    };
  },
  mutations: {
    increment(state, payload) {
      state.count += payload;
    },
    setFullscreen(state, payload) {
      state.isFullscreen = payload;
    },
    addBuycarts(state, payload) {
      state.buycarts.push(payload);
    },
    addBuycartsNum(state, payload) {
      state.buycarts[payload].num++;
    },
    minusBuycartsNum(state, payload) {
      state.buycarts[payload].num--;
      if (state.buycarts[payload].num == 0) {
        state.buycarts.splice(payload, 1);
      }
    },
  },
  getters: {
    totalPrice(state) {
      let total = state.buycarts.reduce((pre, item) => {
        return pre + item.price * item.num;
      }, 0);
      return total;
    },
  },
  actions: {
    asyncAdd(store, payload) {
      setTimeout(() => {
        store.commit("increment", payload);
      }, 1000);
    },
  },
});

export default store;
