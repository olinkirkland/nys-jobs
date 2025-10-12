<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.card {
    border: 1px solid var(--surface-border);
    border-radius: 5px;
    padding: 2rem;
    box-shadow: var(--shadow-sm);
    background-color: var(--surface);
}
</style>
