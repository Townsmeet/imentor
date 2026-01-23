<template>
  <div class="py-12 sm:py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h1>
      
      <div class="space-y-8">
        <div v-for="category in faqs" :key="category.name">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            {{ category.name }}
          </h2>
          <div class="space-y-6">
            <div v-for="faq in category.questions" :key="faq.q" class="prose prose-blue dark:prose-invert max-w-none">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ faq.q }}</h3>
              <p class="text-gray-600 dark:text-gray-300">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-16 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">We're here to help. Contact our support team anytime.</p>
        <UButton size="lg">Contact Support</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'FAQ - iMentorsPro',
  description: 'Find answers to frequently asked questions about iMentorsPro.'
})

const faqs = [
  {
    name: 'General',
    questions: [
      {
        q: 'What is iMentorsPro?',
        a: 'iMentorsPro is a platform that connects professionals with expert mentors and coaches for personalized guidance and career growth.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply sign up, complete your profile, and start browsing our directory of mentors and coaches.'
      }
    ]
  },
  {
    name: 'For Mentees',
    questions: [
      {
        q: 'How do I find the right mentor?',
        a: 'You can use our search filters to find mentors by expertise, industry, or price. Our AI matching tool can also suggest mentors based on your goals.'
      },
      {
        q: 'How do I book a session?',
        a: 'Once you find a mentor you like, click on their profile and select an available time slot from their calendar.'
      }
    ]
  },
  {
    name: 'For Mentors',
    questions: [
      {
        q: 'How do I become a mentor?',
        a: 'Click on "Become a Mentor" in the footer or header, and follow the registration process. We vet all mentors to ensure high-quality guidance.'
      },
      {
        q: 'How do I get paid?',
        a: 'Payments are processed securely through the platform and transferred to your linked bank account after each successful session.'
      }
    ]
  }
]
</script>
