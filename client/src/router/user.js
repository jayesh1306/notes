import store from '../store/index'

import Container from '../container/MainContainer'

//User Views
import Dashboard from '../components/user/dashboard'


export default {
    path: "/user",
    component: Container,
    redirect: "/user/dashboard",
    children: [{
        path: "/user/dashboard",
        component: Dashboard
    }],
    beforeEnter(to, from, next) {
        console.log(to, from, next);

        if (!store.state.auth.token) {
            next('/auth/login');
        } else {
            next()
        }
    }
};