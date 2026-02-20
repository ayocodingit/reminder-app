<script setup lang="ts">
const props = defineProps<{
    show: boolean;
    reminderTitle: string;
}>();

const emit = defineEmits(['close', 'confirm']);

const days = ref(30);

const presets = [7, 14, 30, 60, 90];

function selectPreset(val: number) {
    days.value = val;
}

function handleConfirm() {
    if (days.value > 0) {
        emit('confirm', days.value);
        days.value = 30; // reset
    }
}
</script>

<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity duration-300"
                @click="emit('close')"></div>

            <!-- Modal Content -->
            <div
                class="relative bg-white w-full max-w-sm rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-gray-100/50 overflow-hidden animate-bounce-in">
                <div class="p-8">
                    <div class="text-center mb-6">
                        <div
                            class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-black text-gray-900 mb-1">Renew Reminder</h2>
                        <p class="text-xs text-gray-500">Add extra days to <span class="font-bold text-indigo-600">{{
                            reminderTitle }}</span></p>
                    </div>

                    <div class="space-y-6">
                        <!-- Day Input -->
                        <div class="relative">
                            <input v-model.number="days" type="number"
                                class="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl text-center text-3xl font-black text-gray-900 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                                min="1" />
                            <span
                                class="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300 uppercase tracking-widest pointer-events-none">Days</span>
                        </div>

                        <!-- Presets -->
                        <div class="flex flex-wrap justify-between gap-2">
                            <button v-for="p in presets" :key="p" @click="selectPreset(p)" :class="[
                                'flex-1 min-w-[50px] h-10 rounded-xl text-xs font-black transition-all border',
                                days === p
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200 hover:text-indigo-600'
                            ]">
                                +{{ p }}
                            </button>
                        </div>

                        <div class="pt-4 flex gap-3">
                            <button @click="emit('close')"
                                class="flex-1 h-14 bg-gray-50 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-gray-100 transition-all">
                                Cancel
                            </button>
                            <button @click="handleConfirm"
                                class="flex-[2] h-14 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                Confirm
                            </button>
                        </div>
                    </div>
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

@keyframes bounce-in {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }

    70% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-bounce-in {
    animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Remove arrows/spinners from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>
