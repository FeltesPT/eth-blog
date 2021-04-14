import { ethers } from 'ethers';

export const state = {
    address: String | "0x0",
    balance: ethers.utils.BigNumber | 0,
    etherBalance: String | "0"
};
const getters = {
    accountAddress: (state) => state.address,
    accountBalance: (state) => state.balance,
    accountEthBalance: (state) => state.etherBalance,
};
const actions = {
    async GetAddress({ commit }) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
        const signer = provider.getSigner()
        
        const address = await signer.getAddress()
        commit('setAddress', address)

        const balance = await provider.getBalance(address)
        commit('setBalance', balance)
        commit('setEtherBalance', balance)
    },
};
const mutations = {
    setAddress(state, address) {
        state.address = address;
    },

    setBalance(state, balance) {
        state.balance = balance;
    },

    setEtherBalance(state, balance) {
        state.etherBalance = ethers.utils.formatEther(balance);
    }
};
export default {
    state,
    getters,
    actions,
    mutations,
};
