<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:academic-cap" class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">iMentorsPro</span>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">How it works</a>
            <a href="#categories" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Categories</a>
            <NuxtLink to="/mentors" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Browse Mentors</NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            <NuxtLink to="/auth/login">
              <UButton variant="ghost" color="neutral">Log in</UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Icon name="heroicons:sparkles" class="w-4 h-4 mr-2" />
              Trusted by 10,000+ professionals
            </div>
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Unlock Your Potential with 
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Expert Mentors</span>
            </h1>
            
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Connect with industry leaders who've been where you want to go. Get personalized guidance, actionable advice, and accelerate your career growth.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
              <NuxtLink to="/discover">
                <UButton size="xl" class="w-full sm:w-auto">
                  <Icon name="heroicons:rocket-launch" class="w-5 h-5 mr-2" />
                  Find a Mentor
                </UButton>
              </NuxtLink>
              <NuxtLink to="/auth/register?role=mentor">
                <UButton size="xl" variant="outline" class="w-full sm:w-auto">
                  <Icon name="heroicons:academic-cap" class="w-5 h-5 mr-2" />
                  Become a Mentor
                </UButton>
              </NuxtLink>
            </div>
            
            <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
                Free to browse
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
          
          <div class="relative hidden lg:block">
            <div class="relative z-10">
              <!-- Mentor Cards Stack -->
              <div class="absolute top-0 right-0 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform rotate-3 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">JD</div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Jane Doe</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Product Lead @ Google</p>
                  </div>
                </div>
                <div class="flex items-center space-x-1 mb-3">
                  <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-4 h-4 text-yellow-400" />
                  <span class="text-sm text-gray-500 ml-2">5.0 (128 reviews)</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">Product Strategy</span>
                  <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">Leadership</span>
                </div>
              </div>
              
              <div class="absolute top-32 left-0 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform -rotate-2 border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">MS</div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Michael Smith</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Senior Engineer @ Meta</p>
                  </div>
                </div>
                <div class="flex items-center space-x-1 mb-3">
                  <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-4 h-4 text-yellow-400" />
                  <span class="text-sm text-gray-500 ml-2">4.9 (96 reviews)</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">System Design</span>
                  <span class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">Career Growth</span>
                </div>
              </div>
            </div>
            
            <!-- Decorative elements -->
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"></div>
            <div class="absolute bottom-0 -left-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">500+</p>
            <p class="text-gray-600 dark:text-gray-400">Expert Mentors</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">10k+</p>
            <p class="text-gray-600 dark:text-gray-400">Active Learners</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">25k+</p>
            <p class="text-gray-600 dark:text-gray-400">Sessions Completed</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">4.9</p>
            <p class="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started in minutes and begin your journey to success
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="relative">
            <div class="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Create Your Profile
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Sign up and tell us about your goals, interests, and what you're looking to achieve in your career.
              </p>
            </div>
            <div class="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <Icon name="heroicons:arrow-right" class="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          <div class="relative">
            <div class="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Find Your Perfect Mentor
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Browse our curated list of mentors, filter by expertise, and find someone who aligns with your goals.
              </p>
            </div>
            <div class="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <Icon name="heroicons:arrow-right" class="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          <div>
            <div class="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Book & Grow
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Schedule sessions at your convenience, meet via video call, and start accelerating your career growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section id="categories" class="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Categories
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find mentors across a wide range of industries and expertise areas
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <NuxtLink 
            v-for="category in featuredCategories" 
            :key="category.name"
            :to="`/mentors?category=${encodeURIComponent(category.name)}`"
            class="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
          >
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', category.bgColor]">
              <Icon :name="category.icon" :class="['w-6 h-6', category.iconColor]" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ category.count }}+ mentors</p>
          </NuxtLink>
        </div>

        <div class="text-center mt-10">
          <NuxtLink to="/mentors">
            <UButton variant="outline" size="lg">
              View All Categories
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose iMentorsPro?
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We've built the tools you need for a seamless mentorship experience
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon name="heroicons:shield-check" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Verified Experts
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              All mentors are vetted professionals with proven track records in their fields.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon name="heroicons:calendar-days" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Flexible Scheduling
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Book sessions that fit your schedule with our intuitive calendar system.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon name="heroicons:video-camera" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              HD Video Calls
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Crystal-clear video meetings built right into the platform. No extra apps needed.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Direct Messaging
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Stay connected with your mentor through our secure messaging system.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon name="heroicons:credit-card" class="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure Payments
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Safe and secure payment processing with money-back guarantee.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4">
              <Icon name="heroicons:sparkles" class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI Matching
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Our smart algorithm helps you find the perfect mentor based on your goals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p class="text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their careers
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div class="flex items-center space-x-1 mb-4">
              <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-5 h-5 text-yellow-400" />
            </div>
            <p class="text-white mb-6">
              "Found an amazing mentor who helped me transition from engineering to product management. Best investment in my career!"
            </p>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">SK</div>
              <div>
                <p class="font-semibold text-white">Sarah Kim</p>
                <p class="text-sm text-blue-200">Product Manager @ Stripe</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div class="flex items-center space-x-1 mb-4">
              <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-5 h-5 text-yellow-400" />
            </div>
            <p class="text-white mb-6">
              "As a mentor, I love how easy the platform makes it to manage bookings and connect with ambitious professionals."
            </p>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">DR</div>
              <div>
                <p class="font-semibold text-white">David Rodriguez</p>
                <p class="text-sm text-blue-200">VP Engineering @ Netflix</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div class="flex items-center space-x-1 mb-4">
              <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-5 h-5 text-yellow-400" />
            </div>
            <p class="text-white mb-6">
              "The AI matching feature connected me with a mentor who understood exactly what I needed. Doubled my freelance rates in 3 months!"
            </p>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">AL</div>
              <div>
                <p class="font-semibold text-white">Alex Liu</p>
                <p class="text-sm text-blue-200">Freelance Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Accelerate Your Career?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who are already growing with iMentorsPro. 
          Start your journey today.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/discover">
            <UButton size="xl">
              <Icon name="heroicons:rocket-launch" class="w-5 h-5 mr-2" />
              Get Started for Free
            </UButton>
          </NuxtLink>
          <NuxtLink to="/mentors">
            <UButton size="xl" variant="outline">
              Browse Mentors
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="heroicons:academic-cap" class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold">iMentorsPro</span>
            </div>
            <p class="text-gray-400 text-sm">
              Connecting ambitious professionals with world-class mentors.
            </p>
          </div>
          
          <div>
            <h4 class="font-semibold mb-4">Platform</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><NuxtLink to="/mentors" class="hover:text-white transition">Browse Mentors</NuxtLink></li>
              <li><NuxtLink to="/auth/signup?role=mentor" class="hover:text-white transition">Become a Mentor</NuxtLink></li>
              <li><a href="#how-it-works" class="hover:text-white transition">How It Works</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition">About Us</a></li>
              <li><a href="#" class="hover:text-white transition">Careers</a></li>
              <li><a href="#" class="hover:text-white transition">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} iMentorsPro. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white transition">
              <Icon name="simple-icons:twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition">
              <Icon name="simple-icons:linkedin" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition">
              <Icon name="simple-icons:github" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'iMentorsPro - Connect with Expert Mentors',
  description: 'Accelerate your career growth with world-class mentors. Join iMentorsPro to find the perfect mentor or share your expertise.',
  ogTitle: 'iMentorsPro - Professional Mentorship Platform',
  ogDescription: 'Connect with expert mentors and accelerate your career growth.',
  twitterCard: 'summary_large_image',
})

const featuredCategories = [
  { name: 'Software Engineering', icon: 'heroicons:code-bracket', bgColor: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', count: 120 },
  { name: 'Product Management', icon: 'heroicons:cube', bgColor: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', count: 85 },
  { name: 'Data Science', icon: 'heroicons:chart-bar', bgColor: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', count: 65 },
  { name: 'UX Design', icon: 'heroicons:paint-brush', bgColor: 'bg-pink-100 dark:bg-pink-900/30', iconColor: 'text-pink-600 dark:text-pink-400', count: 70 },
  { name: 'Marketing', icon: 'heroicons:megaphone', bgColor: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', count: 55 },
  { name: 'Leadership', icon: 'heroicons:user-group', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', iconColor: 'text-cyan-600 dark:text-cyan-400', count: 90 },
  { name: 'Entrepreneurship', icon: 'heroicons:rocket-launch', bgColor: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400', count: 45 },
  { name: 'Finance', icon: 'heroicons:banknotes', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', count: 40 },
]
</script>
