<script setup>
    import { onBeforeMount, reactive, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import api from '../api.js';
    import { useGlobalStore } from '../stores/global';
    import { Notyf } from 'notyf';

    const route = useRoute();
    const router = useRouter();
    const { user } = useGlobalStore();
    const notyf = new Notyf();
    const course = reactive({ data: {} });
    const enrollmentCount = ref(0);
    const isEnrolling = ref(false);

    async function handleEnroll() {
        if (isEnrolling.value) return;
        isEnrolling.value = true;
        try {
            let { data } = await api.post('/enrollments/enroll', {
                enrolledCourses: [{ courseId: course.data._id }],
                totalPrice: course.data.price
            });
            if (data.success === true) {
                notyf.success("Enrolled successfully!");
                router.push({ path: '/courses' });
            } else {
                notyf.error("Enrollment Failed");
            }
        } catch (e) {
            notyf.error(e.response?.data?.message || "Enrollment Failed");
        } finally {
            isEnrolling.value = false;
        }
    }

    onBeforeMount(async () => {
        try {
            let { data } = await api.get(`/courses/specific/${route.params.id}`);
            course.data = data;

            // Fetch enrollment count for this course
            let countRes = await api.get(`/courses/${data._id}/students`);
            enrollmentCount.value = countRes.data.studentCount || 0;
        } catch (e) {
            console.log(e);
        }
    });

    async function fetchCourse() {
        try {
            const { data } = await api.get(
                `/courses/specific/${route.params.id}`
            );

            course.data = data;

            const countRes = await api.get(
                `/courses/${data._id}/students`
            );

            enrollmentCount.value =
                countRes.data.studentCount || 0;

        } catch (error) {
            console.log(error);
        }
    }

    onBeforeMount(fetchCourse);

    watch(
        () => route.params.id,
        fetchCourse
    );
</script>

<template>
    <div class="vc-shell" v-if="course.data && course.data._id">
        <div class="vc-card">

            <!-- Course image -->
            <div class="vc-image-wrap">
                <img
                    class="vc-image"
                    :src="course.data.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'"
                    :alt="course.data.name"
                />
                <div class="vc-image-overlay">
                    <span class="vc-tag">Course</span>
                </div>
            </div>

            <!-- Course details -->
            <div class="vc-body">

                <!-- Price + Status row -->
                <div class="vc-meta-row">
                    <span class="vc-price-big">₱{{ course.data.price?.toLocaleString() }}</span>
                    <span class="vc-status-chip"
                        :class="course.data?.isActive
                            ? 'chip-active'
                            : 'chip-archived'"
                    >
                        {{ course.data.isActive ? 'Active' : 'Archived' }}
                    </span>
                </div>

                <h1 class="vc-title">{{ course.data.name }}</h1>

                <!-- Course meta tags -->
                <div class="vc-tags-row" v-if="course.data.category">
                    <span class="vc-meta-tag">{{ course.data.category }}</span>
                    <span class="vc-meta-tag">{{ course.data.level }}</span>
                    <span class="vc-meta-tag">{{ course.data.duration }}</span>
                </div>

                <div class="vc-divider"></div>

                <!-- Enrollment count — prominent -->
                <div class="vc-enrollment-box">
                    <div class="vc-enrollment-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                        <span class="vc-enrollment-count">{{ enrollmentCount }}</span>
                        <span class="vc-enrollment-label">students enrolled</span>
                    </div>
                </div>

                <div class="vc-divider"></div>

                <h6 class="vc-desc-label">About this course</h6>
                <p class="vc-desc">{{ course.data.description }}</p>

                <!-- Actions -->
                <div class="vc-actions">
                    <button
                        v-if="user.email && !user.isAdmin && course.data?.isActive"
                        class="vc-enroll-btn"
                        :class="{ 'vc-btn-loading': isEnrolling }"
                        @click="handleEnroll"
                        :disabled="isEnrolling"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        {{ isEnrolling ? 'Enrolling...' : 'Enroll Now' }}
                    </button>

                    <div
                        v-if="user.email && !user.isAdmin && !course.data.isActive"
                        class="vc-admin-notice"
                    >
                        This course is archived and no longer available.
                    </div>

                    <div v-if="user.email && user.isAdmin" class="vc-admin-notice">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Admins cannot enroll in courses
                    </div>

                    <router-link v-if="!user.email" to="/login" class="vc-login-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        Login to Enroll
                    </router-link>

                    <button class="vc-back-btn" @click="router.push('/courses')">
                        ← Back to Courses
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>