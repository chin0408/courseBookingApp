<script>
export default {
    props: {
        coursesData: Array,
        editCourse: Function,
        archiveCourse: Function,
        activateCourse: Function
    }
}
</script>

<template>
    <div class="admin-shell">

        <!-- Header -->
        <div class="dash-header">
            <div class="dash-title-group">
                <span class="dash-eyebrow">Management Console</span>
                <h1 class="dash-title">Course Dashboard</h1>
            </div>
            <div class="dash-meta">
                <div class="stat-pill">
                    <span class="stat-num">{{ coursesData.length }}</span>
                    <span class="stat-label">Total</span>
                </div>
                <div class="stat-pill active-pill">
                    <span class="stat-num">{{ coursesData.filter(c => c.isActive).length }}</span>
                    <span class="stat-label">Active</span>
                </div>
                <div class="stat-pill inactive-pill">
                    <span class="stat-num">{{ coursesData.filter(c => !c.isActive).length }}</span>
                    <span class="stat-label">Archived</span>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="table-card">
            <table class="dash-table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in coursesData" :key="course._id" class="dash-row" :class="{ 'row-inactive': !course.isActive }">
                        <td>
                            <div class="course-name-cell">
                                <div class="course-dot" :class="course.isActive ? 'dot-active' : 'dot-inactive'"></div>
                                <div>
                                    <span class="course-name">{{ course.name }}</span>
                                    <span class="course-id">{{ (course._id || course.id || '').slice(-8) }}</span>
                                </div>
                            </div>
                        </td>
                        <td><span class="desc-text">{{ course.description }}</span></td>
                        <td><span class="price-badge">₱{{ course.price.toLocaleString() }}</span></td>
                        <td>
                            <span class="status-chip" :class="course.isActive ? 'chip-active' : 'chip-inactive'">
                                {{ course.isActive ? 'Active' : 'Archived' }}
                            </span>
                        </td>
                        <td>
                            <div class="action-group">
                                <button class="btn-edit" @click="editCourse(course._id)">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                </button>

                                <!-- Toggle: Archive if active, Activate if inactive -->
                                <button
                                    v-if="course.isActive"
                                    class="btn-archive"
                                    @click="archiveCourse(course._id)"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                                    Archive
                                </button>
                                <button
                                    v-else
                                    class="btn-activate"
                                    @click="activateCourse(course._id)"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                    Activate
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
