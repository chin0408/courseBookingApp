<script setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';
import ResetPassword from '../components/ResetPassword.vue';
import UpdateProfile from '../components/UpdateProfile.vue';

const { user } = useGlobalStore();
const router = useRouter();

onBeforeMount(() => {
    if (!user.email) router.push({ path: '/' });
});
</script>

<template>
    <div class="profile-shell" v-if="user.email">

        <!-- Top banner -->
        <div class="profile-banner">
            <div class="profile-avatar">
                {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
            </div>
            <div class="profile-banner-info">
                <span class="profile-eyebrow">{{ user.isAdmin ? 'Administrator' : 'Student' }}</span>
                <h1 class="profile-fullname">{{ user.firstName }} {{ user.lastName }}</h1>
                <div class="profile-badges">
                    <span class="profile-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {{ user.email }}
                    </span>
                    <span class="profile-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.98-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.28A16 16 0 0 0 13.72 16.09l.89-.89a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {{ user.mobileNo }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Cards row -->
        <div class="profile-cards-row">
            <ResetPassword />
            <UpdateProfile />
        </div>

    </div>
</template>