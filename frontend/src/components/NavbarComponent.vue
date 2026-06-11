<script setup>
import { useGlobalStore } from '../stores/global';

const store = useGlobalStore();
const user = store.user;
</script>

<template>
    <nav class="app-navbar navbar navbar-expand-lg sticky-top">
        <div class="container">
            <router-link :to="{ name: 'Home' }" class="app-brand navbar-brand">ZUITT</router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ms-auto app-nav-links">
                    <router-link :to="{ name: 'Courses' }" class="nav-link">Courses</router-link>
                    <router-link :to="{ name: 'Enrollments' }" class="nav-link" v-if="!user.isAdmin && user.email">My Courses</router-link>
                    <router-link :to="{ name: 'News' }" class="nav-link" v-if="!user.isAdmin && user.email">News</router-link>
                    <router-link :to="{ name: 'Profile' }" class="nav-link" v-if="user.email">Profile</router-link>
                    <router-link :to="{ path: '/addCourse' }" class="nav-link" v-if="user.isAdmin">Add Course</router-link>
                    <router-link :to="{ name: 'AdminEnrollments' }" class="nav-link" v-if="user.isAdmin">Enrollments</router-link>
                    <router-link :to="{ name: 'Register' }" class="nav-link" v-if="!user.email">Register</router-link>
                    <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!user.email">Login</router-link>
                    <router-link :to="{ name: 'Logout' }" class="nav-link nav-logout" v-else>Logout</router-link>
                </div>
            </div>
        </div>
    </nav>
</template>
