<script setup lang="ts">
const props = defineProps<{
    title: string;
    category: string;
    expiryDate: string;
    daysLeft: number;
    iconBgColor: string;
}>();

const urgencyClass = computed(() => {
    if (props.daysLeft <= 3) return 'bg-zinc-900 text-white border-zinc-900';
    if (props.daysLeft <= 7) return 'bg-zinc-100 text-zinc-900 border-zinc-200';
    return 'bg-white text-zinc-400 border-zinc-100';
});

const progressWidth = computed(() => {
    // Mock progress calculation: assuming 30 days is the max window we care about
    const progress = Math.max(0, Math.min(100, (props.daysLeft / 30) * 100));
    return `${100 - progress}%`;
});

const barColor = computed(() => {
    if (props.daysLeft <= 3) return 'bg-zinc-900';
    if (props.daysLeft <= 7) return 'bg-zinc-500';
    return 'bg-zinc-300';
});
</script>

<template>
    <div
        class="bg-white rounded-[24px] p-5 flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
        <!-- Icon Container -->
        <div
            :class="[iconBgColor, 'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500']">
            <slot name="icon" />
        </div>

        <!-- Details -->
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
                <h3 class="font-black text-gray-900 truncate leading-tight tracking-tight">{{ title }}</h3>
                <span :class="[urgencyClass, 'text-[9px] px-2 py-0.5 rounded-full font-black border']">
                    {{ daysLeft }} DAYS
                </span>
            </div>
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{{ category }} • {{ expiryDate
            }}</p>

            <!-- Progress Bar -->
            <div class="h-1 bg-gray-100 rounded-full w-full">
                <div :class="[barColor, 'h-full rounded-full transition-all duration-1000 ease-out']"
                    :style="{ width: progressWidth }"></div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button @click="$emit('renew')" title="Extend"
                class="w-8 h-8 flex items-center justify-center text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                <span class="text-[9px] font-black">EXT</span>
            </button>
            <button @click="$emit('edit')"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </button>
            <button @click="$emit('delete')"
                class="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    </div>
</template>
