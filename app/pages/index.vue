<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div class="text-center">
          <div class="flex justify-center mb-8">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Icon name="heroicons:academic-cap" class="w-8 h-8 text-white" />
            </div>
          </div>

          <h1
            class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Welcome to
            <span
              class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              iMentorsPro
            </span>
          </h1>

          <p
            class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Connect with world-class mentors and accelerate your career growth.
            Whether you're looking to learn new skills or share your expertise,
            we're here to make meaningful connections happen.
          </p>

          <div class="w-full max-w-lg mx-auto">
            <p
              class="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center"
            >
              Join our waitlist to get early access
            </p>
            <WaitlistForm />
            <p class="mt-3 text-xs text-gray-400 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
        class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
      >
        <div
          class="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"
        ></div>
        <div
          class="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"
        ></div>
        <div
          class="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse delay-2000"
        ></div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose iMentorsPro?
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform is designed to create meaningful mentorship
            relationships that drive real career growth and personal
            development.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon
                name="heroicons:users"
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              Expert Mentors
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Connect with industry professionals who have walked the path you
              want to take.
            </p>
          </div>

          <div
            class="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div
              class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon
                name="heroicons:calendar-days"
                class="w-6 h-6 text-purple-600 dark:text-purple-400"
              />
            </div>
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              Flexible Scheduling
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Book sessions that fit your schedule with our intuitive calendar
              system.
            </p>
          </div>

          <div
            class="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Icon
                name="heroicons:chat-bubble-left-right"
                class="w-6 h-6 text-green-600 dark:text-green-400"
              />
            </div>
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              Seamless Communication
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Stay connected with built-in messaging and video call integration.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Start Your Journey?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Join thousands of professionals who are already growing their careers
          with iMentorsPro.
        </p>

        <div class="w-full max-w-lg mx-auto">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
            Join our waitlist to get early access
          </p>
          <WaitlistForm />
          <p class="mt-3 text-xs text-gray-400 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page meta
definePageMeta({
  layout: "default",
});

// SEO
useSeoMeta({
  title: "iMentorsPro - Connect with Expert Mentors",
  description:
    "Accelerate your career growth with world-class mentors. Join iMentorsPro to find the perfect mentor or share your expertise.",
  ogTitle: "iMentorsPro - Professional Mentorship Platform",
  ogDescription:
    "Connect with expert mentors and accelerate your career growth.",
  twitterCard: "summary_large_image",
});
</script>
