import Container from '../container/MainContainer'

//Auth Views
import Login from '../components/auth/login'
import Register from '../components/auth/register'
import VerifyMobile from '../components/auth/verifyMobile'
import emailVerify from '../components/auth/emailVerify'

export default {
    path: "/auth",
    component: Container,
    redirect: "/auth/login",
    children: [{
            path: "/auth/login",
            component: Login
        },
        {
            path: "/auth/register",
            component: Register
        },
        {
            path: '/auth/verifyMobile',
            component: VerifyMobile
        },
        {
            path: '/auth/emailVerify/:token',
            component: emailVerify
        }
    ]
};