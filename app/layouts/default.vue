<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader v-if="!isAuthPage" />
    <main :class="{ 'pt-16': !isAuthPage }">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const isAuthPage = computed(() => {
  return route.path.startsWith('/auth') || route.path === '/'
})

// Initialize auth on mount
onMounted(() => {
  if (process.client) {
    const { init } = useAuth()
    init()
  }
})
</script>
