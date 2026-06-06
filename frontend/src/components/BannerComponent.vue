<script>
export default {
    props: {
        bannerProps: Object
    }
}
</script>

<template>
    <section class="hero-shell">
        <div class="hero-card">
            <span class="dash-eyebrow">Course Booking Platform</span>
            <h1 class="hero-title">{{ bannerProps.title }}</h1>
            <p class="hero-subtitle">{{ bannerProps.tagline }}</p>
            <router-link class="hero-cta" :to="{ name: bannerProps.destination }">
                {{ bannerProps.buttonLabel }}
                <i class="bi bi-arrow-right"></i>
            </router-link>
        </div>
    </section>
</template>
