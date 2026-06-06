<script>
    import newsData from '../data/newsData.js';

    import { reactive, ref, watch, onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router';
    import { Notyf } from 'notyf';

    import NewsComponent from '../components/NewsComponent.vue';

    import { useGlobalStore } from '../stores/global.js';

    
    export default {
        components: {
            NewsComponent
        },
        setup() {

            const router = useRouter();
            const { user } = useGlobalStore();

            onBeforeMount(() => {
                if (user.isAdmin) {
                    router.push('/courses');
                }
            });

            const news = reactive(newsData);

            const email = ref("");
            const feedback = ref("");
            const isEnabled = ref(false);

            const notyf = new Notyf();

            watch([email,feedback], (currentValue, oldValue) => {

                if(currentValue.every(input => input !== "")){
                    isEnabled.value = true;
                } else {
                    isEnabled.value = false;
                }
            });

            function handleSubmit(e){
                
                e.preventDefault();

                notyf.success("Feedback Sent");

                email.value = "";
                feedback.value = "";
            }

            // onBeforeMount(()=>{ 
            //     userEmail.value = localStorage.getItem("email")
            // });


            return {
                news,
                email,
                feedback,
                isEnabled,
                handleSubmit,
                // userEmail,
                user

            }
        }
    }
</script>

<template>
    <main class="news-shell">
        <header class="news-page-header">
            <span class="news-eyebrow">Latest Updates</span>
            <h1 class="news-page-title">News & Promotions</h1>
            <p class="news-page-sub">Stay updated with course announcements, referral offers, and enrollment promos.</p>
        </header>

        <div class="news-grid">
            <NewsComponent v-for="indivNews in news" :key="indivNews.id" :newsData="indivNews"/>
        </div>

        <section class="feedback-section" v-if="user.email">
            <div class="feedback-inner">
                <div class="feedback-header">
                    <span class="form-eyebrow">Your Feedback</span>
                    <h2 class="feedback-title">Help us improve</h2>
                </div>

                <form v-on:submit="handleSubmit" class="feedback-form">
                    <div class="feedback-field">
                        <label for="emailInput" class="field-label">Email Address</label>
                        <div class="field-wrap" :class="{ 'field-filled': email }">
                            <i class="bi bi-envelope field-icon"></i>
                            <input type="email" class="field-input" id="emailInput" v-model="email" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div class="feedback-field">
                        <label for="feedbackInput" class="field-label">Feedback</label>
                        <div class="field-wrap textarea-wrap" :class="{ 'field-filled': feedback }">
                            <i class="bi bi-chat-square-text field-icon"></i>
                            <textarea class="field-input" id="feedbackInput" placeholder="Let us know what you think" rows="5" v-model="feedback"></textarea>
                        </div>
                    </div>
                    <div class="feedback-actions">
                        <button type="submit" class="btn-submit" :class="{ 'btn-ready': isEnabled }" :disabled="!isEnabled">Send Feedback</button>
                    </div>
                </form>
            </div>
        </section>

        <div class="feedback-login-nudge" v-else>
            <p>Login to share your feedback with the team.</p>
            <router-link class="nudge-btn" :to="{ name: 'Login' }">Login</router-link>
        </div>
    </main>
</template>