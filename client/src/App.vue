<template>
    <!-- Layout -->
    <div class="app-layout">
        <div class="jobs-container-layout">
            <TheFilters></TheFilters>
            <div class="jobs-container-layout__nested">
                <!-- Input TODO -->
                <p>{{ jobs.length }} listings found</p>
                <TheJobsList :jobs="jobs"></TheJobsList>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Use Axios to fetch data from the backend
import axios from 'axios';
import { onMounted, ref } from 'vue';
import TheFilters from './components/TheFilters.vue';
import TheJobsList from './components/TheJobsList.vue';
import { Job } from './job';

const jobs = ref<Array<Partial<Job>>>([]);
onMounted(() => fetchJobs());

function fetchJobs() {
    axios
        .get('http://s:3001/api/jobs')
        .then((response) => {
            response.data.forEach((jobData: any) => {
                const job: Partial<Job> = {};
                Object.assign(job, jobData);
                job.publishDate = new Date(jobData.publishDate);
                job.deadline = new Date(jobData.deadline);
                jobs.value.push(job);
            });
        })
        .catch((error) => {
            console.error('There was an error fetching the jobs!', error);
        });
}
</script>

<style lang="scss">
@use '@/styles/reset.scss';
@use '@/styles/variables.scss';
@use '@/styles/styles.scss';

.jobs-container-layout {
    margin: 0 auto;
    display: flex;
    height: 100vh;
    .jobs-container-layout__nested {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        > p {
            padding: 1rem;
            padding-bottom: 0;
            text-align: center;
        }
    }
}
</style>
