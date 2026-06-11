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
const filter = ref('all');

onMounted(async () => {
    if (!store.user.email || !store.user.isAdmin) {
        router.push({ path: '/' });
        return;
    }

    try {
        const { data } = await api.get('/enrollments/admin/all');
        enrollments.value = data;
    } catch (error) {
        notyf.error("Failed to load enrollments");
    } finally {
        isLoading.value = false;
    }
});

const filteredEnrollments = () => {
    if (filter.value === 'all') return enrollments.value;
    return enrollments.value.filter(e => e.course?.name === filter.value);
};

const uniqueCourses = () => {
    const names = enrollments.value
        .map(e => e.course?.name)
        .filter(Boolean);
    return [...new Set(names)];
};

const totalStudents = () => {
    const uniqueIds = new Set(enrollments.value.map(e => e.student?._id).filter(Boolean));
    return uniqueIds.size;
};
</script>

<template>
    <div class="admin-shell">
        <!-- Header -->
        <div class="dash-header">
            <div class="dash-title-group">
                <span class="dash-eyebrow">Admin Panel</span>
                <h1 class="dash-title">Student Enrollments</h1>
            </div>
            <div class="dash-meta">
                <div class="stat-pill">
                    <span class="stat-num">{{ enrollments.length }}</span>
                    <span class="stat-label">Enrollments</span>
                </div>
                <div class="stat-pill active-pill">
                    <span class="stat-num">{{ totalStudents() }}</span>
                    <span class="stat-label">Students</span>
                </div>
                <div class="stat-pill">
                    <span class="stat-num">{{ uniqueCourses().length }}</span>
                    <span class="stat-label">Courses</span>
                </div>
            </div>
        </div>

        <!-- Filter -->
        <div style="margin-bottom: 1.5rem;">
            <select class="field-input" v-model="filter" style="max-width: 300px; padding: 0.5rem 1rem;">
                <option value="all">All Courses</option>
                <option v-for="name in uniqueCourses()" :key="name" :value="name">{{ name }}</option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="empty-state">Loading enrollments...</div>

        <!-- Empty -->
        <div v-else-if="enrollments.length === 0" class="empty-state">No enrollments found.</div>

        <!-- Table -->
        <div v-else class="table-card">
            <table class="dash-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Enrolled On</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="enrollment in filteredEnrollments()" :key="enrollment._id" class="dash-row">
                        <td>
                            <span class="course-name" v-if="enrollment.student">
                                {{ enrollment.student.firstName }} {{ enrollment.student.lastName }}
                            </span>
                            <span v-else class="desc-text">Unknown</span>
                        </td>
                        <td><span class="desc-text">{{ enrollment.student?.email || 'N/A' }}</span></td>
                        <td><span class="desc-text">{{ enrollment.student?.mobileNo || 'N/A' }}</span></td>
                        <td>
                            <span class="course-name">{{ enrollment.course?.name || 'Removed' }}</span>
                        </td>
                        <td><span class="desc-text">{{ enrollment.course?.category || '-' }}</span></td>
                        <td><span class="price-badge">₱{{ enrollment.totalPrice?.toLocaleString() }}</span></td>
                        <td><span class="desc-text">{{ new Date(enrollment.enrolledOn).toLocaleDateString() }}</span></td>
                        <td>
                            <span class="status-chip chip-active">{{ enrollment.status }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
