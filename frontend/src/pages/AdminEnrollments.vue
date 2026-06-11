<script setup>
import { ref, computed, onMounted } from 'vue';
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
const viewMode = ref('table'); // 'table' or 'byCourse'

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

const filteredEnrollments = computed(() => {
    if (filter.value === 'all') return enrollments.value;
    return enrollments.value.filter(e => e.course?.name === filter.value);
});

const uniqueCourses = computed(() => {
    const names = enrollments.value
        .map(e => e.course?.name)
        .filter(Boolean);
    return [...new Set(names)];
});

const totalStudents = computed(() => {
    const uniqueIds = new Set(enrollments.value.map(e => e.student?._id).filter(Boolean));
    return uniqueIds.size;
});

// Group enrollments by course for the "By Course" view
const enrollmentsByCourse = computed(() => {
    const grouped = {};
    enrollments.value.forEach(e => {
        const courseName = e.course?.name || 'Unknown Course';
        if (!grouped[courseName]) {
            grouped[courseName] = {
                course: e.course,
                students: []
            };
        }
        grouped[courseName].students.push({
            ...e.student,
            enrolledOn: e.enrolledOn,
            totalPrice: e.totalPrice,
            status: e.status
        });
    });
    return grouped;
});

// Group enrollments by student for student detail view
const enrollmentsByStudent = computed(() => {
    const grouped = {};
    enrollments.value.forEach(e => {
        const studentId = e.student?._id || 'unknown';
        const studentName = e.student
            ? `${e.student.firstName} ${e.student.lastName}`
            : 'Unknown Student';
        if (!grouped[studentId]) {
            grouped[studentId] = {
                student: e.student,
                name: studentName,
                courses: []
            };
        }
        grouped[studentId].courses.push({
            ...e.course,
            enrolledOn: e.enrolledOn,
            totalPrice: e.totalPrice,
            status: e.status
        });
    });
    return grouped;
});
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
                <div class="stat-pill active-pill">
                    <span class="stat-num">{{ enrollments.length }}</span>
                    <span class="stat-label">Total Enrollees</span>
                </div>
                <div class="stat-pill">
                    <span class="stat-num">{{ totalStudents }}</span>
                    <span class="stat-label">Students</span>
                </div>
                <div class="stat-pill">
                    <span class="stat-num">{{ uniqueCourses.length }}</span>
                    <span class="stat-label">Courses</span>
                </div>
            </div>
        </div>

        <!-- View toggle + filter -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center;">
            <div class="action-group">
                <button class="btn-edit" :class="{ 'btn-active': viewMode === 'table' }" @click="viewMode = 'table'">All Enrollments</button>
                <button class="btn-edit" :class="{ 'btn-active': viewMode === 'byCourse' }" @click="viewMode = 'byCourse'">By Course</button>
                <button class="btn-edit" :class="{ 'btn-active': viewMode === 'byStudent' }" @click="viewMode = 'byStudent'">By Student</button>
            </div>

            <select v-if="viewMode === 'table'" class="field-input" v-model="filter" style="max-width: 250px; padding: 0.5rem 1rem;">
                <option value="all">All Courses</option>
                <option v-for="name in uniqueCourses" :key="name" :value="name">{{ name }}</option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="empty-state">Loading enrollments...</div>

        <!-- Empty -->
        <div v-else-if="enrollments.length === 0" class="empty-state">No enrollments found.</div>

        <!-- TABLE VIEW -->
        <div v-else-if="viewMode === 'table'" class="table-card">
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
                    <tr v-for="enrollment in filteredEnrollments" :key="enrollment._id" class="dash-row">
                        <td>
                            <span class="course-name" v-if="enrollment.student">
                                {{ enrollment.student.firstName }} {{ enrollment.student.lastName }}
                            </span>
                            <span v-else class="desc-text">Unknown</span>
                        </td>
                        <td><span class="desc-text">{{ enrollment.student?.email || 'N/A' }}</span></td>
                        <td><span class="desc-text">{{ enrollment.student?.mobileNo || 'N/A' }}</span></td>
                        <td><span class="course-name">{{ enrollment.course?.name || 'Removed' }}</span></td>
                        <td><span class="desc-text">{{ enrollment.course?.category || '-' }}</span></td>
                        <td><span class="price-badge">₱{{ enrollment.totalPrice?.toLocaleString() }}</span></td>
                        <td><span class="desc-text">{{ new Date(enrollment.enrolledOn).toLocaleDateString() }}</span></td>
                        <td><span class="status-chip chip-active">{{ enrollment.status }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- BY COURSE VIEW -->
        <div v-else-if="viewMode === 'byCourse'">
            <div
                v-for="(group, courseName) in enrollmentsByCourse"
                :key="courseName"
                class="table-card"
                style="margin-bottom: 1.5rem;"
            >
                <div style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 1rem; font-weight: 600;">{{ courseName }}</h3>
                        <span class="desc-text" v-if="group.course">{{ group.course.category }} · {{ group.course.level }}</span>
                    </div>
                    <div class="stat-pill active-pill">
                        <span class="stat-num">{{ group.students.length }}</span>
                        <span class="stat-label">enrolled</span>
                    </div>
                </div>
                <table class="dash-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Enrolled On</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(student, idx) in group.students" :key="idx" class="dash-row">
                            <td><span class="course-name">{{ student.firstName }} {{ student.lastName }}</span></td>
                            <td><span class="desc-text">{{ student.email || 'N/A' }}</span></td>
                            <td><span class="desc-text">{{ student.mobileNo || 'N/A' }}</span></td>
                            <td><span class="desc-text">{{ new Date(student.enrolledOn).toLocaleDateString() }}</span></td>
                            <td><span class="status-chip chip-active">{{ student.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- BY STUDENT VIEW -->
        <div v-else-if="viewMode === 'byStudent'">
            <div
                v-for="(group, studentId) in enrollmentsByStudent"
                :key="studentId"
                class="table-card"
                style="margin-bottom: 1.5rem;"
            >
                <div style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 1rem; font-weight: 600;">{{ group.name }}</h3>
                        <span class="desc-text" v-if="group.student">{{ group.student.email }} · {{ group.student.mobileNo }}</span>
                    </div>
                    <div class="stat-pill">
                        <span class="stat-num">{{ group.courses.length }}</span>
                        <span class="stat-label">courses</span>
                    </div>
                </div>
                <table class="dash-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Enrolled On</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(course, idx) in group.courses" :key="idx" class="dash-row">
                            <td><span class="course-name">{{ course.name || 'Removed' }}</span></td>
                            <td><span class="desc-text">{{ course.category || '-' }}</span></td>
                            <td><span class="price-badge">₱{{ course.price?.toLocaleString() }}</span></td>
                            <td><span class="desc-text">{{ new Date(course.enrolledOn).toLocaleDateString() }}</span></td>
                            <td><span class="status-chip chip-active">{{ course.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
