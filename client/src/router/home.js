import Container from '../container/MainContainer';


import Contact from '../components/contact'
import Home from '../components/home'


export default {
    path: '/',
    component: Container,
    children: [{
            path: '/',
            component: Home
        },
        {
            path: '/contact',
            component: Contact
        },
    ]
}