<script setup lang="ts">
const reminders = ref<any[]>([]);
const isFormOpen = ref(false);
const isRenewModalOpen = ref(false);
const editingReminder = ref<any>(null);
const renewingReminder = ref<any>(null);

const { permission, requestPermission, notify } = useNotifications();

useSeoMeta({
    title: 'Reminder PRO',
    description: 'Premium Reminder App with Flexible Extensions',
});

// Persistence Logic
onMounted(() => {
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
        reminders.value = JSON.parse(storedReminders);
    } else {
        // Dummy Initial Data
        reminders.value = [
            { id: 1, title: 'IM3 Pasca Bayar', category: 'Provider', expiryDate: '2026-03-15', type: 'sim', iconBgColor: 'bg-zinc-100' },
            { id: 2, title: 'Spotify Family', category: 'Music', expiryDate: '2026-02-28', type: 'music', iconBgColor: 'bg-zinc-500' },
            { id: 3, title: 'PLN Token', category: 'Electricity', expiryDate: '2026-02-22', type: 'electricity', iconBgColor: 'bg-zinc-300' }
        ];
        saveToStorage();
    }
    checkReminders();
});

function saveToStorage() {
    localStorage.setItem('reminders', JSON.stringify(reminders.value));
}

// CRUD Actions
function openAddForm() {
    editingReminder.value = null;
    isFormOpen.value = true;
}

function openEditForm(reminder: any) {
    editingReminder.value = { ...reminder };
    isFormOpen.value = true;
}

function handleSave(formData: any) {
    if (editingReminder.value) {
        // Update
        const index = reminders.value.findIndex(r => r.id === editingReminder.value.id);
        if (index !== -1) {
            reminders.value[index] = { ...formData, id: editingReminder.value.id };
        }
    } else {
        // Create
        reminders.value.push({
            ...formData,
            id: Date.now()
        });
    }

    saveToStorage();
    isFormOpen.value = false;
}

function handleDelete(id: number) {
    reminders.value = reminders.value.filter(r => r.id !== id);
    saveToStorage();
}

function handleRenew(reminder: any) {
    renewingReminder.value = reminder;
    isRenewModalOpen.value = true;
}

function confirmRenewal(days: number) {
    if (!renewingReminder.value) return;

    const currentExpiry = new Date(renewingReminder.value.expiryDate);
    currentExpiry.setDate(currentExpiry.getDate() + days);

    // Format back to YYYY-MM-DD
    const newDate = currentExpiry.toISOString().split('T')[0];

    const index = reminders.value.findIndex(r => r.id === renewingReminder.value.id);
    if (index !== -1) {
        reminders.value[index] = { ...renewingReminder.value, expiryDate: newDate };
        saveToStorage();
    }

    isRenewModalOpen.value = false;
    renewingReminder.value = null;
    checkReminders(); // check again after renewal
}

function checkReminders() {
    reminders.value.forEach(r => {
        const daysLeft = calculateDaysLeft(r.expiryDate);
        if (daysLeft <= 0) {
            notify(`EXPIRED: ${r.title}`, { body: `Your ${r.category} reminder has expired!` });
        } else if (daysLeft <= 3) {
            notify(`URGENT: ${r.title}`, { body: `${r.title} will expire in ${daysLeft} days!` });
        }
    });
}

// Helpers
const sortedReminders = computed(() => {
    return [...reminders.value].sort((a, b) => {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
});

const urgentCount = computed(() => reminders.value.filter(r => calculateDaysLeft(r.expiryDate) <= 7).length);

function calculateDaysLeft(dateStr: string) {
    const expiry = new Date(dateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

function formatDate(dateStr: string) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}
</script>

<template>
    <div class="h-full bg-gray-50 flex flex-col w-full overflow-hidden font-sans relative">
        <!-- Fixed Header with Glassmorphism -->
        <header
            class="sticky top-0 z-50 px-6 safe-top flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100/10 shrink-0">
            <div class="flex flex-col py-4">
                <span class="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">My Space</span>
                <h1 class="text-xl font-black text-gray-900 leading-none flex items-center gap-2">
                    Reminders
                    <span
                        class="bg-zinc-900 text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow-sm">PRO</span>
                </h1>
            </div>
            <div class="flex items-center gap-3">
                <button @click="requestPermission" :class="[
                    'w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-white border border-gray-100 shadow-sm active:scale-90 relative group/btn',
                    permission === 'granted' ? 'text-zinc-900' : 'text-gray-400 hover:text-zinc-900 hover:border-gray-200'
                ]" title="Enable Notifications">
                    <!-- Subtle Glow when not granted -->
                    <div v-if="permission === 'default'"
                        class="absolute inset-0 bg-zinc-900/5 rounded-2xl animate-pulse"></div>

                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 relative z-10 group-hover/btn:rotate-12 transition-transform" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div v-if="permission === 'default'"
                        class="absolute top-2.5 right-2.5 w-2 h-2 bg-zinc-900 rounded-full border-2 border-white z-20">
                    </div>
                </button>
            </div>
        </header>

        <!-- Scrollable Content Area -->
        <main class="flex-1 overflow-y-auto px-6 pt-6 pb-40 no-scrollbar">
            <!-- Empty State -->
            <div v-if="reminders.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">No reminders yet</h3>
                <p class="text-xs text-gray-500">Tap the "+" button below to create your first reminder.</p>
            </div>

            <template v-else>
                <!-- Summary Section -->
                <SummaryCard :totalReminders="reminders.length" :urgentReminders="urgentCount" />

                <!-- Content Header -->
                <div class="flex justify-between items-center mb-6 px-1">
                    <h2 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Upcoming Schedules</h2>
                    <div
                        class="text-[9px] font-black text-indigo-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        LIVE SYNC
                    </div>
                </div>

                <!-- List -->
                <div class="space-y-4">
                    <ReminderCard v-for="rem in sortedReminders" :key="rem.id" :title="rem.title"
                        :category="rem.category" :expiryDate="formatDate(rem.expiryDate)"
                        :daysLeft="calculateDaysLeft(rem.expiryDate)" :iconBgColor="rem.iconBgColor"
                        @edit="openEditForm(rem)" @delete="handleDelete(rem.id)" @renew="handleRenew(rem)">
                        <template #icon v-if="rem.type === 'sim'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <line x1="7" y1="8" x2="7" y2="8" />
                                <line x1="7" y1="12" x2="7" y2="12" />
                                <line x1="7" y1="16" x2="7" y2="16" />
                                <line x1="11" y1="8" x2="11" y2="8" />
                                <line x1="11" y1="12" x2="11" y2="12" />
                                <line x1="11" y1="16" x2="11" y2="16" />
                                <line x1="15" y1="8" x2="15" y2="8" />
                                <line x1="15" y1="12" x2="15" y2="12" />
                                <line x1="15" y1="16" x2="15" y2="16" />
                            </svg>
                        </template>
                        <template #icon v-else-if="rem.type === 'tv'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                                <polyline points="17 2 12 7 7 2" />
                            </svg>
                        </template>
                        <template #icon v-else-if="rem.type === 'wifi'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                                <line x1="12" y1="20" x2="12.01" y2="20" />
                            </svg>
                        </template>
                        <template #icon v-else-if="rem.type === 'bolt'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                        </template>
                        <template #icon v-else-if="rem.type === 'music'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                        </template>
                    </ReminderCard>
                </div>
            </template>
        </main>

        <!-- Floating Action Button -->
        <button @click="openAddForm"
            class="fixed bottom-28 right-8 w-14 h-14 bg-gray-900 rounded-2xl shadow-2xl flex items-center justify-center text-white ring-4 ring-white active:scale-90 transition-all duration-300 z-50 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 transition-transform group-hover:rotate-90"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
        </button>

        <!-- Reminder Form Modal -->
        <ReminderForm :show="isFormOpen" :editData="editingReminder" @close="isFormOpen = false" @save="handleSave" />

        <!-- Renew Modal -->
        <RenewModal :show="isRenewModalOpen" :reminderTitle="renewingReminder?.title || ''"
            @close="isRenewModalOpen = false" @confirm="confirmRenewal" />
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');

.font-sans {
    font-family: 'Inter', sans-serif;
}

main::-webkit-scrollbar {
    display: none;
}

main {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>