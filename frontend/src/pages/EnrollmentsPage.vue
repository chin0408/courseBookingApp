<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';
import api from '../api.js';
import { Notyf } from 'notyf';

const store = useGlobalStore();
const router = useRouter();
const notyf = new Notyf();

const enrollments = ref([]);
const isLoading = ref(true);

onMounted(async () => {
    if (!store.user.email || store.user.isAdmin) {
        router.push({ path: '/' });
        return;
    }

    try {
        const { data } = await api.get('/enrollments/get-enrollments');
        // Fetch course details for each enrollment
        const enriched = await Promise.all(
            data.map(async (enrollment) => {
                const coursesWithDetails = await Promise.all(
                    enrollment.enrolledCourses.map(async (ec) => {
                        try {
                            const courseRes = await api.get(`/courses/specific/${ec.courseId}`);
                            return { ...ec, courseDetails: courseRes.data };
                        } catch {
                            return { ...ec, courseDetails: null };
                        }
                    })
                );
                return { ...enrollment, enrolledCourses: coursesWithDetails };
            })
        );
        enrollments.value = enriched;
    } catch (error) {
        if (error.response?.status !== 404) {
            notyf.error("Failed to load enrollments");
        }
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="enrollments-shell">
        <div class="section-header">
            <span class="dash-eyebrow">My Learning</span>
            <h1 class="section-title">My Enrolled Courses</h1>
            <p class="section-subtitle">Track your learning progress and enrolled programs.</p>
        </div>

        <div v-if="isLoading" class="empty-state">
            Loading your enrollments...
        </div>

        <div v-else-if="enrollments.length === 0" class="empty-state">
            <p>You haven't enrolled in any courses yet.</p>
            <router-link to="/courses" class="btn-submit btn-ready" style="display:inline-block; text-decoration:none; margin-top:1rem; padding:0.75rem 1.5rem;">
                Browse Courses
            </router-link>
        </div>

        <div v-else class="course-grid">
            <div
                v-for="enrollment in enrollments"
                :key="enrollment._id"
                class="course-grid-item"
            >
                <article
                    v-for="ec in enrollment.enrolledCourses"
                    :key="ec.courseId"
                    class="course-card-modern"
                >
                    <div class="course-card-media" v-if="ec.courseDetails">
                        <img
                            :src="ec.courseDetails.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'"
                            :alt="ec.courseDetails.name"
                            style="width:100%; height:220px; object-fit:cover;"
                        />
                        <span class="course-card-tag" style="background: var(--color-green);">Enrolled</span>
                    </div>

                    <div class="course-card-body" v-if="ec.courseDetails">
                        <h3>{{ ec.courseDetails.name }}</h3>
                        <p>{{ ec.courseDetails.description }}</p>

                        <div class="course-card-footer">
                            <span class="price-badge">
                                ₱{{ Number(enrollment.totalPrice).toLocaleString() }}
                            </span>
                            <span class="status-chip chip-active">
                                {{ enrollment.status }}
                            </span>
                        </div>

                        <div style="margin-top: 0.75rem; font-size: 0.8rem; color: var(--color-subtle);">
                            Enrolled on {{ new Date(enrollment.enrolledOn).toLocaleDateString() }}
                        </div>
                    </div>

                    <div class="course-card-body" v-else>
                        <h3>Course Unavailable</h3>
                        <p>This course may have been removed.</p>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>
