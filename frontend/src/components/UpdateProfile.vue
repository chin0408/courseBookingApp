<script setup>

    import {ref, watch} from 'vue';
    import {Notyf} from 'notyf';

    import {useGlobalStore} from '../stores/global';

    const store = useGlobalStore();

    const firstName = ref("");
    const lastName = ref("");
    const mobileNo = ref("");

    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([firstName, lastName, mobileNo], (currentValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true;
        }else{
            isEnabled.value = false;
        }

    })

    async function updateProfile(){

        try{

            let response = await fetch(`${import.meta.env.VITE_COURSE_BOOKING_API}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${store.user.token}`
                },
                body: JSON.stringify({
                    firstName: firstName.value,
                    lastName: lastName.value,
                    mobileNo: mobileNo.value
                })
            })

            let data = await response.json();

            if(response.ok){

                notyf.success("Profile updated successfully!");

                store.user.firstName = firstName.value;
                store.user.lastName = lastName.value;
                store.user.mobileNo = mobileNo.value;

                await store.getUserDetails(store.user.token);

                firstName.value = "";
                lastName.value = "";
                mobileNo.value = "";

            }else{
                notyf.error(data.message || "Profile update failed.");
            }

        }catch(error){

            console.log(error);

            notyf.error("Something went wrong while updating your profile.");

        }finally{

            console.log("Update profile request finished");

        }

    }

</script>

<template>
    <section class="profile-card">
        <div class="profile-card-header">
            <div class="profile-card-icon"><i class="bi bi-person-gear"></i></div>
            <div>
                <span class="form-eyebrow">Personal Details</span>
                <h2>Update Profile</h2>
            </div>
        </div>

        <form @submit.prevent="updateProfile" class="profile-form">
            <div class="field-group">
                <label class="field-label">First Name</label>
                <div class="field-wrap" :class="{ 'field-filled': firstName }">
                    <i class="bi bi-person field-icon"></i>
                    <input type="text" class="field-input" v-model="firstName" placeholder="First name" required>
                </div>
            </div>

            <div class="field-group">
                <label class="field-label">Last Name</label>
                <div class="field-wrap" :class="{ 'field-filled': lastName }">
                    <i class="bi bi-person field-icon"></i>
                    <input type="text" class="field-input" v-model="lastName" placeholder="Last name" required>
                </div>
            </div>

            <div class="field-group">
                <label class="field-label">Mobile Number</label>
                <div class="field-wrap" :class="{ 'field-filled': mobileNo }">
                    <i class="bi bi-phone field-icon"></i>
                    <input type="text" class="field-input" v-model="mobileNo" placeholder="Mobile number" required>
                </div>
            </div>

            <button type="submit" class="btn-submit" :class="{ 'btn-ready': isEnabled }" :disabled="!isEnabled">Update Profile</button>
        </form>
    </section>
</template>