import axios from '../axios'
import auth from './auth'

const state = {
    userId: auth.state.userId
}

const actions = {
    getUser({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            axios.get(`/getUser/${state.userId}`)
                .then(response => {
                    resolve(response.data)
                    commit();
                })
                .catch(err => {
                    reject(err)
                });
        })
    }
}

const getters = {

}

const mutations = {

}

export default {
    state,
    actions,
    mutations,
    getters
}