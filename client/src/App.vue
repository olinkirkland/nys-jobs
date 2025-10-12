<template>
    <!-- Layout -->
    <div class="app-layout">
        <TheHeader></TheHeader>
        <TheHero></TheHero>
        <div class="jobs-container-layout">
            <TheFilters></TheFilters>
            <TextSearchBar></TextSearchBar>
            <TheJobsList></TheJobsList>
        </div>
        <TheFooter></TheFooter>
    </div>
</template>

<script setup lang="ts">
// Use Axios to fetch data from the backend
import axios from 'axios';
import { ref } from 'vue';
import TextSearchBar from './components/TextSearchBar.vue';
import TheFilters from './components/TheFilters.vue';
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';
import TheHero from './components/TheHero.vue';
import TheJobsList from './components/TheJobsList.vue';
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

.jobs-container-layout {
    max-width: 96rem;
    border: 1px solid red;
    margin: 0 auto;
}
</style>
