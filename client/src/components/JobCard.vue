<template>
    <Card class="full-width">
        <header>
            <div class="name-department-tags">
                <h2>{{ aiParsedJobData?.semanticJobTitle }}</h2>
                <p>
                    <em>{{ job.title }}</em>
                </p>

                <span>{{ job.humanReadableAgency }}</span>

                <div class="tags">
                    <span v-if="job.telecommutingAllowed"><Tag color="green">Telecommuting Allowed</Tag></span>
                    <!-- <span>• <Tag color="orange">Tag 1</Tag></span> -->
                    <!-- <span>• <Tag color="orange">Tag 1</Tag></span> -->
                    <span>Salary Grade {{ job.salaryGrade }}</span>
                    <span>Salary Range ${{ salaryRange.from }} - ${{ salaryRange.to }}</span>
                </div>
            </div>

            <div class="location-date">
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>{{ job.county }}</p>
                </div>
                <div class="date">
                    <p class="muted">Posted on {{ job.publishDate?.toDateString() }}</p>
                    <p class="muted">Closes on {{ job.deadline?.toDateString() }}</p>
                </div>
            </div>
        </header>
        <ul class="description-list">
            <li v-for="str in aiParsedJobData?.threeBulletPointsDescription">
                {{ str }}
            </li>
        </ul>
        <!-- <pre v-if="aiParsedJobData">{{ aiParsedJobData }}</pre> -->
        <a :href="job.link" target="_blank">{{ job.link }}</a>
    </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AIParsedJobData, Job } from '../job';
import { calculateSalaryRangeFromGrade } from '@/salary-grade-calculator';
const props = defineProps<{
    job: Partial<Job>;
}>();

const aiParsedJobData: AIParsedJobData | null = props.job.humanReadableExtractedData
    ? (props.job.humanReadableExtractedData as AIParsedJobData)
    : null;

const salaryRange = computed(() => {
    return calculateSalaryRangeFromGrade(props.job.salaryGrade || '') || { from: 'N/A', to: 'N/A' };
});
</script>

<style scoped lang="scss">
.card {
    cursor: pointer;
    transition: box-shadow, 0.2s;
    &:hover {
        box-shadow: var(--shadow-md);
    }
}

header {
    display: flex;
    width: 100%;
    gap: 2rem;
    .name-department-tags {
        flex: 1;
        font-size: 1.2rem;

        .tags {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            > *:not(:first-of-type)::before {
                content: '•';
                margin: 0 0.4rem;
            }
        }
    }

    .location-date {
        .location {
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }
    }
}

ul.description-list {
    padding: 1rem;
    border: 1px solid var(--surface-border);
    border-radius: 5px;
    li {
        list-style: disc;
        margin-left: 2rem;
    }
}

.card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
