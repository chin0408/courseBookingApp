<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
    import api from '../api.js';

    const firstName = ref("");
    const lastName = ref("");
    const mobileNum = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPass = ref("");
    const isEnabled = ref(false);
    const isSubmitting = ref(false);
    const passwordMatch = ref(true);

    const notyf = new Notyf();
    const router = useRouter();
    const { user } = useGlobalStore();

    watch([email, password, confirmPass, firstName, lastName, mobileNum], (cv) => {
        passwordMatch.value = cv[1] === cv[2];
        isEnabled.value = cv.every(i => i !== "") && cv[1] === cv[2];
    });

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isEnabled.value || isSubmitting.value) return;
        isSubmitting.value = true;

        try {
            await api.post('/users/check-email', { email: email.value });

            let response = await api.post('/users/register', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                mobileNo: mobileNum.value,
                password: password.value
            });

            if (response.status === 201) {
                notyf.success(response.data.message);
                router.push({ path: '/login' });
            } else {
                notyf.error("Registration Failed. Please contact administrator.");
            }
        } catch (e) {
            if (e.response && (e.response.status === 404 || e.response.status === 401 || e.response.status === 400 || e.response.status === 409)) {
                notyf.error(e.response.data.message);
            } else {
                notyf.error("Registration Failed. Please contact administrator.");
            }
        } finally {
            isSubmitting.value = false;
        }
    }

    onBeforeMount(() => {
        if (user.email) router.push({ path: '/courses' });
    });
</script>

<template>
    <div class="auth-shell">
        <div class="auth-card reg-card">

            <!-- Left accent -->
            <div class="auth-accent">
                <div class="accent-content">
                    <div class="accent-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <h2 class="accent-title">Join Zuitt</h2>
                    <p class="accent-sub">Create your account and start your learning journey today.</p>
                    <div class="accent-dots"><span></span><span></span><span></span></div>
                </div>
                <div class="auth-accent-footer">
                    Already have an account?
                    <router-link to="/login" class="auth-switch-link">Sign in</router-link>
                </div>
            </div>

            <!-- Right form -->
            <div class="auth-form-panel">
                <span class="form-eyebrow">Student Registration</span>
                <h1 class="form-title">Create Account</h1>

                <form @submit.prevent="handleSubmit" class="auth-form">

                    <div class="reg-two-col">
                        <div class="field-group">
                            <label class="field-label">First Name</label>
                            <div class="field-wrap" :class="{ 'field-filled': firstName }">
                                <input type="text" class="field-input" placeholder="Juan" v-model="firstName" />
                            </div>
                        </div>
                        <div class="field-group">
                            <label class="field-label">Last Name</label>
                            <div class="field-wrap" :class="{ 'field-filled': lastName }">
                                <input type="text" class="field-input" placeholder="Dela Cruz" v-model="lastName" />
                            </div>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Mobile Number</label>
                        <div class="field-wrap" :class="{ 'field-filled': mobileNum }">
                            <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.98-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.28A16 16 0 0 0 13.72 16.09l.89-.89a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <input type="text" class="field-input" placeholder="09XXXXXXXXX" v-model="mobileNum" />
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Email Address</label>
                        <div class="field-wrap" :class="{ 'field-filled': email }">
                            <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <input type="email" class="field-input" placeholder="you@email.com" v-model="email" />
                        </div>
                    </div>

                    <div class="reg-two-col">
                        <div class="field-group">
                            <label class="field-label">Password</label>
                            <div class="field-wrap" :class="{ 'field-filled': password }">
                                <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <input type="password" class="field-input" placeholder="Min 8 chars" v-model="password" />
                            </div>
                        </div>
                        <div class="field-group">
                            <label class="field-label">Confirm Password</label>
                            <div class="field-wrap" :class="{ 'field-filled': confirmPass, 'field-error': confirmPass && !passwordMatch }">
                                <svg class="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <input type="password" class="field-input" placeholder="Repeat password" v-model="confirmPass" />
                            </div>
                            <span class="field-hint-error" v-if="confirmPass && !passwordMatch">Passwords don't match</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        class="btn-submit auth-submit"
                        :class="{ 'btn-ready': isEnabled && !isSubmitting }"
                        :disabled="!isEnabled || isSubmitting"
                    >
                        <span v-if="isSubmitting">Creating account...</span>
                        <span v-else-if="!isEnabled">Complete all fields</span>
                        <span v-else>
                            Create Account
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                    </button>

                </form>
            </div>

        </div>
    </div>
</template>