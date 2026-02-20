<template>
    <div class="bg-green-800 w-full h-16 flex items-center justify-center text-white text-lg px-2 shadow-b-lg">
        <button v-if="redirectLabel" @click="redirect">{{ redirectLabel }}</button>
        <h1>{{ title }}</h1>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    props: {
        title: {
            type: String,
            required: true
        },
        redirect: {
            type: String,
            required: true
        },
        redirectLabel: {
            type: String,
            required: false
        }
    }
}


</script>