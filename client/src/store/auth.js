import axios from '../axios'
import router from '../router/index'

const state = {
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
}

const mutations = {
    authUser(state, data) {
        state.token = data.token;
        state.userId = data.userId
        router.replace('/user/dashboard')
    },
    removeUser(state) {
        state.token = null;
        state.userId = null
    }
}

const getters = {
    isAuthenticated(state) {
        return state.token !== null
    },
    user(state) {
        axios.get(`/getUser/${state.userId}`).then(response => {
            return response.data;
        }).catch(err => {
            return err
        });
    }
}

const actions = {
    async login({
        commit
    }, userData) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/login', userData)
                .then(response => {
                    if (response.data.user[0].verified == false) {

                        axios.post('/auth/sendEmail', {
                                email: userData.username
                            })
                            .then(() => {
                                reject({
                                    message: "Email Not Verified!Sent email to above emaill address. Valid for 3 minutes"
                                })
                            })
                            .catch(err => {
                                reject(err)
                            });
                    } else if (response.data.user[0].isMobileVerified == false) {
                        reject({
                            message: "Mobile Not Verified"
                        })
                    } else {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('userId', response.data.user[0]._id)
                        commit('authUser', {
                            userId: response.data.user[0]._id,
                            token: response.data.token
                        });
                        setTimeout(() => {
                            router.push({
                                path: "/user/dashboard"
                            });
                        }, 3000);
                        resolve({
                            message: "Successfully Logged In! Redirecting..."
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    reject(err)
                })
        })
    },
    register({
        commit
    }, userData) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/register', userData)
                .then(response => {
                    console.log(response.data);
                    resolve(response.data)
                    commit();
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status == 400) {
                            reject({
                                message: 'Could\'nt Send SMS. Please try again'
                            })
                        } else if (err.response.status == 401) {
                            reject({
                                message: 'Could\'nt Register. Please try again'
                            })
                        } else if (err.response.status == 402) {
                            reject({
                                message: 'Could\'nt Send Email. Please try again'
                            })
                        } else if (err.response.status == 403) {
                            reject({
                                message: 'Already Registered. Please login'
                            })
                        } else if (err.response.status == 500) {
                            reject({
                                message: 'Something Went Wrong. Please try again'
                            })
                        }
                    }
                    //Response code
                    //400 -> COuld not send sms
                    //401 -> could not register
                    //402 -> Could not send email
                    //403 -> Already Registered
                    //500 -> SOmething went wrong
                });
        })
    },
    sendMail({
        commit
    }, email) {
        return new Promise((resolve, reject) => {
            console.log(email);
            axios.post('/auth/sendEmail', email)
                .then(response => {
                    resolve(response.data);
                    commit();
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                });
        })
    },
    verifyMobile({
        commit,
    }, data) {
        return new Promise((resolve, reject) => {
            axios.post('/auth/mobileVerification', {
                    mobile: localStorage.getItem('contact'),
                    code: data.code
                })
                .then(response => {
                    localStorage.removeItem('contact')
                    commit();
                    resolve(response.data)
                })
                .catch(err => {
                    if (err) {
                        if (err.response.status == 400) {
                            reject({
                                message: 'Phone number or code Invalid.'
                            })
                        } else if (err.response.status == 401) {
                            reject({
                                message: 'Couldnt Verify Mobile Number'
                            })
                        } else {
                            reject({
                                message: 'Something went wrong'
                            })
                        }
                    }
                });
        })
    },
    emailVerify({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            axios.get('/auth/verify/' + data.token)
                .then(response => {
                    console.log(response)
                    commit();
                })
                .catch(err => {
                    console.log(err);

                    reject(err)
                });
        })
    },
    autologin({
        commit,
    }) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token) {
            return;
        }
        commit('authUser', {
            token,
            userId
        })
    },
    logout({
        commit
    }) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId')
        commit('removeUser');
        router.replace('/auth/login')
    },
}

export default {
    state,
    actions,
    mutations,
    getters
}