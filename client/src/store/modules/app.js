import Blog from '../../contracts/Blog.json'
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = Blog.networks['5777'].address;
const provider = new ethers.providers.Web3Provider(window.ethereum)
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

export const state = {
    contract: ethers.Contract
};
const getters = {
    contract: (state) => state.contract,
};
const actions = {
    async LoadContracts({commit}) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider.getSigner())
      commit('setContracts', { contract })
    }
};
const mutations = {
    setContracts(state, contract) {
        state.contract = contract.contract;
    },
};
export default {
    state,
    getters,
    actions,
    mutations,
};
