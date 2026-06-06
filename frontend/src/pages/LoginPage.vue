<script setup>

    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import axios from 'axios';
    import { useGlobalStore } from '../stores/global.js';
    import { useRouter } from 'vue-router';

    const store = useGlobalStore();
    const getUserDetails = store.getUserDetails;
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email, password], (currentValue) => {
        isEnabled.value = currentValue.every(input => input !== "");
    });

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            let res = await axios.post(`${import.meta.env.VITE_COURSE_BOOKING_API}/users/login`, {
                email: email.value,
                password: password.value
            });

            if (res.data) {
                notyf.success("Login Successful");
                localStorage.setItem("token", res.data.access);
                getUserDetails(res.data.access);
                email.value = "";
                password.value = "";
                router.push({ path: '/courses' });
            }

        } catch (e) {
            // FIX: Guard against e.response being undefined (e.g. network down)
            if (e.response && (e.response.status === 404 || e.response.status === 401 || e.response.status === 400)) {
                notyf.error(e.response.data.message);
            } else {
                notyf.error("Login Failed. Please contact administrator.");
            }
        }
    }

    onBeforeMount(() => {
        if (store.user.email) {
            router.push({ path: '/courses' });
        }
    });
</script>

<template>
    <div class="auth-shell">
        <div class="auth-card">
            <aside class="auth-accent">
                <div class="accent-content">
                    <div class="accent-icon"><i class="bi bi-shield-lock fs-2"></i></div>
                    <h1 class="accent-title">Welcome Back</h1>
                    <p class="accent-sub">Access your courses, profile, and admin tools from one polished workspace.</p>
                </div>
                <div class="auth-accent-footer">New here? <router-link class="auth-switch-link" :to="{ name: 'Register' }">Create account</router-link></div>
            </aside>

            <section class="auth-form-panel">
                <span class="form-eyebrow">Account Access</span>
                <h1 class="form-title">Login</h1>

                <form v-on:submit="handleSubmit" class="auth-form">
                    <div class="field-group">
                        <label for="emailInput" class="field-label">Email Address</label>
                        <div class="field-wrap" :class="{ 'field-filled': email }">
                            <i class="bi bi-envelope field-icon"></i>
                            <input type="email" class="field-input" id="emailInput" v-model="email" placeholder="you@example.com" />
                        </div>
                    </div>

                    <div class="field-group">
                        <label for="passwordInput" class="field-label">Password</label>
                        <div class="field-wrap" :class="{ 'field-filled': password }">
                            <i class="bi bi-lock field-icon"></i>
                            <input type="password" class="field-input" id="passwordInput" v-model="password" placeholder="Enter password" />
                        </div>
                    </div>

                    <button type="submit" class="btn-submit auth-submit" :class="{ 'btn-ready': isEnabled }" :disabled="!isEnabled">Login</button>
                </form>
            </section>
        </div>
    </div>
</template>