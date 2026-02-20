<script setup lang="ts">
const props = defineProps<{
    show: boolean;
    editData?: any;
}>();

const emit = defineEmits(['close', 'save']);

const form = ref({
    title: '',
    category: '',
    expiryDate: '',
    type: 'sim',
    iconBgColor: 'bg-indigo-500'
});

const categories = [
    { label: 'Provider', value: 'Provider', type: 'sim', color: 'bg-zinc-100' },
    { label: 'Subscription', value: 'Subscription', type: 'tv', color: 'bg-zinc-200' },
    { label: 'Internet', value: 'Internet', type: 'wifi', color: 'bg-zinc-300' },
    { label: 'Utilities', value: 'Utilities', type: 'bolt', color: 'bg-zinc-400' },
    { label: 'Music', value: 'Music', type: 'music', color: 'bg-zinc-500' },
];

watch(() => props.editData, (newVal) => {
    if (newVal) {
        form.value = { ...newVal };
    } else {
        resetForm();
    }
}, { immediate: true });

function resetForm() {
    form.value = {
        title: '',
        category: 'Provider',
        expiryDate: '',
        type: 'sim',
        iconBgColor: 'bg-zinc-100'
    };
}

function handleCategoryChange(cat: any) {
    form.value.category = cat.value;
    form.value.type = cat.type;
    form.value.iconBgColor = cat.color;
}

function submit() {
    if (!form.value.title || !form.value.expiryDate) return;
    emit('save', { ...form.value });
    resetForm();
}
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity duration-300"
                @click="emit('close')"></div>

            <!-- Modal Content -->
            <div
                class="relative bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100/50 overflow-hidden animate-slide-up">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-black text-gray-900">{{ editData ? 'Edit Reminder' : 'New Reminder' }}
                        </h2>
                        <button @click="emit('close')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submit" class="space-y-5">
                        <div>
                            <label
                                class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                            <input v-model="form.title" type="text" placeholder="e.g. Netflix Premium"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                required />
                        </div>

                        <div>
                            <label
                                class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="cat in categories" :key="cat.value" type="button"
                                    @click="handleCategoryChange(cat)" :class="[
                                        'px-3 py-2 rounded-xl text-xs font-bold border transition-all',
                                        form.category === cat.value
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                                    ]">
                                    {{ cat.label }}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Expiry
                                Date</label>
                            <input v-model="form.expiryDate" type="date"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                required />
                        </div>

                        <div class="pt-6">
                            <button type="submit"
                                class="w-full h-14 bg-zinc-900 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] hover:bg-zinc-800 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                {{ editData ? 'Update Reminder' : 'Create Reminder' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes slide-up {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
