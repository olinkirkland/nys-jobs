<template>
    <div>
        <h1>Job Listings</h1>
        <button @click="fetchJobs">Fetch Jobs</button>
        <div class="job-card-grid">
            <JobCard v-for="job in jobs" :key="job.id" :job="job" />
        </div>
    </div>
</template>

<script setup lang="ts">
// Use Axios to fetch data from the backend
import axios from 'axios';
import { ref } from 'vue';
import JobCard from './components/JobCard.vue';
import { Job } from './job';
const jobs = ref<Array<Partial<Job>>>([]);

function fetchJobs() {
    axios
        .get('http://localhost:3001/api/jobs')
        .then((response) => {
            response.data.forEach((jobData: any) => {
                const job: Partial<Job> = {};
                job.id = jobData.id;
                job.title = jobData.title;
                job.county = jobData.county;
                job.publishDate = new Date(jobData.publishDate);
                job.deadline = new Date(jobData.deadline);
                job.link = jobData.link;
                job.summaryHash = jobData.summaryHash;
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

.job-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(32rem, 1fr));
    grid-auto-rows: 1fr;
    gap: 1rem;
    padding: 2rem;
}
</style>
