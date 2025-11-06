<script setup lang="ts">
import { ref } from "vue";

const toast = useToast();

const email = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {

  isLoading.value = true;

  try {
    const { error } = await useFetch("/api/waitlist", {
      method: "POST",
      body: { email: email.value },
    });

    if (error.value) {
      throw error.value;
    }
    toast.add({
      title: "Success!",
      description: "Thanks for joining!",
      color: "success",
    });
    email.value = "";
  } catch (error: any) {
    toast.add({
      title: "Error joining waitlist",
      description: "Failed to join. Try again.",
      color: "error",
    });
    console.error("Error joining waitlist:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-lg">
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col sm:flex-row gap-2 w-full"
    >
      <UInput
        v-model="email"
        type="email"
        placeholder="Enter your email"
        :disabled="isLoading"
        class="flex-1"
        size="xl"
        required
      />

      <UButton
        type="submit"
        :loading="isLoading"
        color="primary"
        size="xl"
        class="whitespace-nowrap justify-center"
      >
        Join Waitlist
      </UButton>
    </form>
  </div>
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
</style>
