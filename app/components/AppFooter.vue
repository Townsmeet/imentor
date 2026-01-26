<template>
  <footer class="bg-gray-50 text-gray-900 py-16 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:academic-cap" class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold">iMentorsPro</span>
          </div>
          <p class="text-gray-600 text-sm">
            Connecting ambitious professionals with world-class mentors and coaches.
          </p>
        </div>
        
        <div>
          <h4 class="font-semibold mb-4">Platform</h4>
          <ul class="space-y-2 text-gray-600 text-sm">
            <li><NuxtLink to="/mentors" class="hover:text-blue-600 transition">Browse Mentors & Coaches</NuxtLink></li>
            <li><NuxtLink to="/auth/register?role=mentor" class="hover:text-blue-600 transition">Become a Mentor/Coach</NuxtLink></li>
            <li><NuxtLink to="/#how-it-works" class="hover:text-blue-600 transition">How It Works</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold mb-4">Company</h4>
          <ul class="space-y-2 text-gray-600 text-sm">
            <li><NuxtLink to="/about" class="hover:text-blue-600 transition">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-blue-600 transition">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-blue-600 transition">FAQ</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h4 class="font-semibold mb-4">Legal</h4>
          <ul class="space-y-2 text-gray-600 text-sm">
            <li><NuxtLink to="/privacy" class="hover:text-blue-600 transition">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-blue-600 transition">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/cookies" class="hover:text-blue-600 transition">Cookie Policy</NuxtLink></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-600 text-sm">
          © {{ new Date().getFullYear() }} iMentorsPro. All rights reserved.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-gray-600 hover:text-blue-600 transition">
            <Icon name="simple-icons:twitter" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition">
            <Icon name="simple-icons:linkedin" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-600 hover:text-blue-600 transition">
            <Icon name="simple-icons:github" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
