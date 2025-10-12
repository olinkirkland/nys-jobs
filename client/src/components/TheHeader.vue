<template>
    <header class="flex spread">
        <div class="flex center">
            <img src="/assets/nys-icon.png" />
            <h4>Empire State Careers</h4>
        </div>
        <IconButton>
            <i class="fas fa-info-circle"></i>
        </IconButton>
    </header>
</template>

<style lang="scss" scoped>
header {
    display: flex;
    gap: 1rem;
    padding: 2rem;

    h4 {
        color: var(--primary);
    }

    img {
        width: 2rem;
    }
}
</style>
