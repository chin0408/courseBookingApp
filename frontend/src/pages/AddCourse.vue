<script setup>
import { ref, watch } from 'vue';
import { Notyf } from 'notyf';
import api from '../api';
import { useRouter } from 'vue-router';

const router = useRouter();
const notyf = new Notyf();

const name = ref("");
const description = ref("");
const price = ref(0);

const category = ref("Frontend");
const level = ref("Beginner");
const duration = ref("4 Weeks");
const imageUrl = ref("");

const isEnabled = ref(false);

const categoryOptions = [
    "Frontend",
    "Backend",
    "Full Stack",
    "QA",
    "Cloud",
    "Mobile",
    "DevOps",
    "Data Science"
];

const levelOptions = [
    "Beginner",
    "Intermediate",
    "Advanced"
];

const durationOptions = [
    "4 Weeks",
    "6 Weeks",
    "8 Weeks",
    "10 Weeks",
    "12 Weeks"
];

watch(
    [name, description, price, category, level, duration, imageUrl],
    (currentValue) => {

        if (
            currentValue[0] !== "" &&
            currentValue[1] !== "" &&
            currentValue[2] > 0 &&
            currentValue[3] !== "" &&
            currentValue[4] !== "" &&
            currentValue[5] !== "" &&
            currentValue[6] !== ""
        ) {
            isEnabled.value = true;
        } else {
            isEnabled.value = false;
        }
    }
);

async function handleSubmit(e) {
    e.preventDefault();

    try {

        const res = await api.post('/courses/', {
            name: name.value,
            description: description.value,
            price: price.value,
            category: category.value,
            level: level.value,
            duration: duration.value,
            imageUrl: imageUrl.value
        });

        if (res.data) {

            notyf.success("Course added successfully");

            name.value = "";
            description.value = "";
            price.value = 0;
            category.value = "Frontend";
            level.value = "Beginner";
            duration.value = "4 Weeks";
            imageUrl.value = "";

            router.push({ path: '/courses' });
        }

    } catch (e) {
        alert(e.response?.data?.message || "Failed to add course");
    }
}
</script>

<template>
    <div class="add-shell">
        <div class="add-card">
            <aside class="add-accent">
                <div class="accent-content">
                    <div class="accent-icon"><i class="bi bi-journal-plus fs-2"></i></div>
                    <h1 class="accent-title">Create Course</h1>
                    <p class="accent-sub">Add a new course using the same clean admin design system.</p>
                    <div class="accent-dots"><span></span><span></span><span></span></div>
                </div>
            </aside>

            <section class="add-form-panel">
                <span class="form-eyebrow">Admin Console</span>
                <h2 class="form-title">Add New Course</h2>

                <form v-on:submit="handleSubmit" class="add-form">

                    <div class="field-group">
                        <label class="field-label">Course Name</label>
                        <div class="field-wrap" :class="{ 'field-filled': name }">
                            <i class="bi bi-book field-icon"></i>
                            <input
                                type="text"
                                class="field-input"
                                v-model="name"
                                placeholder="e.g. ReactJS Fundamentals"
                            />
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Description</label>
                        <div class="field-wrap textarea-wrap" :class="{ 'field-filled': description }">
                            <i class="bi bi-card-text field-icon"></i>
                            <textarea
                                class="field-input"
                                rows="4"
                                v-model="description"
                                placeholder="Describe what students will learn"
                            ></textarea>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Price</label>
                        <div class="field-wrap" :class="{ 'field-filled': price > 0 }">
                            <i class="bi bi-cash-stack field-icon"></i>
                            <input
                                type="number"
                                class="field-input"
                                v-model="price"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Category</label>
                        <div class="field-wrap">
                            <select class="field-input" v-model="category">
                                <option
                                    v-for="option in categoryOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Level</label>
                        <div class="field-wrap">
                            <select class="field-input" v-model="level">
                                <option
                                    v-for="option in levelOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Duration</label>
                        <div class="field-wrap">
                            <select class="field-input" v-model="duration">
                                <option
                                    v-for="option in durationOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="field-group">
                        <label class="field-label">Image URL</label>
                        <div class="field-wrap">
                            <i class="bi bi-image field-icon"></i>
                            <input
                                type="text"
                                class="field-input"
                                v-model="imageUrl"
                                placeholder="https://example.com/course-image.jpg"
                            />
                        </div>
                    </div>

                    <div class="form-actions">
                        <button
                            type="button"
                            class="btn-cancel"
                            @click="router.push({ path: '/courses' })"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="btn-submit"
                            :class="{ 'btn-ready': isEnabled }"
                            :disabled="!isEnabled"
                        >
                            Add Course
                        </button>
                    </div>

                </form>
            </section>
        </div>
    </div>
</template>
