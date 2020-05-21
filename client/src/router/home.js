import Container from '../container/MainContainer';


import Contact from '../components/contact'

export default {
    path: '/',
    component: Container,
    children: [{
        path: '/contact',
        component: Contact
    }]
}