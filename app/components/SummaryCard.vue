<script setup lang="ts">
defineProps<{
    totalReminders: number;
    urgentReminders: number;
}>();
</script>

<template>
    <div
        class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-6 text-white shadow-[0_20px_40px_rgba(79,70,229,0.2)] mb-8 border border-white/10 relative overflow-hidden group">
        <!-- Sublte Glow Effect -->
        <div
            class="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700">
        </div>

        <div class="flex justify-between items-start mb-6 relative z-10">
            <div>
                <h2 class="text-indigo-100/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">System Status
                </h2>
                <p class="text-xl font-black leading-tight">Overview of your<br />active reminders</p>
            </div>
            <div class="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </div>
        </div>

        <div class="flex gap-3 relative z-10">
            <div class="bg-white/10 flex-1 rounded-2xl p-4 backdrop-blur-md border border-white/5 shadow-sm">
                <div class="text-indigo-200/70 text-[10px] font-bold uppercase tracking-wider mb-1">Total</div>
                <div class="text-2xl font-black tracking-tight">{{ totalReminders }}</div>
            </div>
            <div class="bg-red-500/10 flex-1 rounded-2xl p-4 backdrop-blur-md border border-red-400/20 shadow-sm">
                <div class="text-red-200/70 text-[10px] font-bold uppercase tracking-wider mb-1">Urgent</div>
                <div class="text-2xl font-black tracking-tight text-red-100">{{ urgentReminders }}</div>
            </div>
        </div>
    </div>
</template>
