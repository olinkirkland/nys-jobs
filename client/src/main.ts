import { createApp } from 'vue';
import App from './App.vue';

import Card from '@/components/ui/Card.vue';
import { createPinia } from 'pinia';
import IconButton from './components/ui/IconButton.vue';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
app.use(pinia);

// Components
// app.component('Button', Button);
app.component('Card', Card);
app.component('IconButton', IconButton);

// Load profile from localStorage
// const adventurersStore = useAdventurersStore();
// adventurersStore.loadAdventurersFromLocalStorage();

// Mount the app
app.mount('#app');
