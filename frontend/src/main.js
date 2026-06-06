// main.js - contains the code that starts and displays the Vue application

// Importing Bootstrap and Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import { useGlobalStore } from './stores/global.js';

// Import Notyf
// 'Notyf' is a small JavaScript library used to show clean, modern popup notifications (also called toast messages) on a webpage.import notyf
import 'notyf/notyf.min.css';

// Imports the CSS file that contains global styles for the application
import './assets/main.css'

// Imports the createApp function from the Vue library that contains the logic for creating the Vue application
import { createApp } from 'vue'

// Imports App.vue that contains the main layout where we place and organize components
import App from './App.vue'

// createPinia - function used to create and enable Pinia in the Vue application
import {createPinia} from 'pinia';

// Import page components that will be used in the routing system
import HomePage from './pages/HomePage.vue';
import CoursesPage from './pages/CoursesPage.vue';
import NewsPage from './pages/NewsPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import LoginPage from './pages/LoginPage.vue';
import LogoutPage from './pages/LogoutPage.vue';
import ErrorPage from './pages/ErrorPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import ViewCourse from './pages/ViewCourse.vue';
import AddCourse from './pages/AddCourse.vue';
import EditCourse from './pages/EditCourse.vue';



// Import routing functions from vue-router
// createRouter - creates the router that handles page navigation in the app
// createWebHistory - enables clean URLs and allows navigation without page reload
import {createRouter, createWebHistory} from 'vue-router';

// Create a router instance to manage navigation in the app
const router = createRouter({

	// history - sets how the URL behaves in the browser (navigation style)
	// createWebHistory() - uses browser history for clean URLs and no page reload
	history: createWebHistory(),

	// Define the list of routes
	routes: [
		{
			// URL Path
			path: '/',
			// route name used for navigation
			name: 'Home',
			// component to display
			component: HomePage
		},
		{
			path: '/courses',
			name: 'Courses',
			component: CoursesPage
		},
		{
			path: '/register',
			name: 'Register',
			component: RegisterPage
		},
		{
			path: '/login',
			name: 'Login',
			component: LoginPage
		},
		{
			path: '/logout',
			name: 'Logout',
			component: LogoutPage
		},
		{
		    path: '/news',
		    component: NewsPage,
		    name: 'News',
		},
        {
            path: '/profile',
            name: 'Profile',
            component: ProfilePage
        },
        {
            path: '/courses/:id',
            component: ViewCourse
        },
        { 
            path: '/addCourse',
            name: 'AddCourse',
            component: AddCourse
        },
        {
		    path: '/edit-course/:courseId',
		    component: EditCourse
		},
        {
            path: '/:catchAll(.*)',
            component: ErrorPage
        }   
	]
})


// createApp(App) - creates the Vue application using the App component as the main layout
// .mount('#app') - displays the application in the HTML element with id "app"
// createApp(App).mount('#app')

const app = createApp(App);

// createPinia() - enables Pinia so components can access global stores
const pinia = createPinia();
app.use(pinia);

//  app.use(router) - enable routing in the app so we can switch pages
app.use(router);
app.mount('#app');