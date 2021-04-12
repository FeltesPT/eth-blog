import Web3 from 'web3'

export const state = {
    address: String | "0x0"
};
const getters = {
    accountAddress: (state) => state.address,
};
const actions = {
    async GetAddress({ commit }) {
        var web3js = window.web3
        var web3 = new Web3(web3js.currentProvider)
        web3.eth.getAccounts()
        .then((accounts) => {
            commit('setAddress', accounts[0]);
        })
    },
};
const mutations = {
    setAddress(state, address) {
        state.address = address;
    },
};
export default {
    state,
    getters,
    actions,
    mutations,
};
