<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden" style="height: calc(100vh - 200px);">
      <div class="flex h-full">
        <!-- Conversations Sidebar -->
        <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <!-- Header -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h2>
              <UButton
                icon="heroicons:pencil-square"
                variant="ghost"
                size="sm"
                @click="showNewMessageModal = true"
              />
            </div>
            
            <UInput
              v-model="searchQuery"
              placeholder="Search conversations..."
              icon="heroicons:magnifying-glass"
              size="sm"
            />
          </div>

          <!-- Conversations List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredConversations.length === 0" class="p-4 text-center">
              <Icon name="heroicons:chat-bubble-left-right" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                No conversations yet
              </p>
            </div>
            
            <div v-else>
              <div
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                @click="selectConversation(conversation)"
                :class="[
                  'p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                ]"
              >
                <div class="flex items-start space-x-3">
                  <div class="relative">
                    <UAvatar
                      :src="conversation.otherParticipant.avatar"
                      :alt="conversation.otherParticipant.name"
                      size="md"
                    />
                    <div
                      v-if="conversation.unreadCount > 0"
                      class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span class="text-xs text-white font-medium">
                        {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ conversation.otherParticipant.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatMessageTime(conversation.lastMessage?.timestamp) }}
                      </p>
                    </div>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {{ conversation.lastMessage?.content || 'No messages yet' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col">
          <div v-if="!selectedConversation" class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col">
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <UAvatar
                    :src="selectedConversation.otherParticipant.avatar"
                    :alt="selectedConversation.otherParticipant.name"
                    size="md"
                  />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {{ selectedConversation.otherParticipant.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ selectedConversation.otherParticipant.role === 'mentor' ? 'Mentor' : 'Mentee' }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <UButton
                    icon="heroicons:video-camera"
                    variant="ghost"
                    size="sm"
                    @click="startVideoCall"
                  />
                  <UButton
                    icon="heroicons:phone"
                    variant="ghost"
                    size="sm"
                    @click="startAudioCall"
                  />
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
              <div
                v-for="message in selectedConversationMessages"
                :key="message.id"
                :class="[
                  'flex',
                  message.senderId === user?.id ? 'justify-end' : 'justify-start'
                ]"
              >
                <div
                  :class="[
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.senderId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  ]"
                >
                  <p class="text-sm">{{ message.content }}</p>
                  <p
                    :class="[
                      'text-xs mt-1',
                      message.senderId === user?.id
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    ]"
                  >
                    {{ formatMessageTime(message.timestamp) }}
                  </p>
                </div>
              </div>
              
              <div v-if="isTyping" class="flex justify-start">
                <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <UInput
                  v-model="newMessage"
                  placeholder="Type your message..."
                  class="flex-1"
                  @keydown="handleTyping"
                />
                <UButton
                  type="submit"
                  icon="heroicons:paper-airplane"
                  :disabled="!newMessage.trim() || isSending"
                  :loading="isSending"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Message Modal -->
    <UModal v-model="showNewMessageModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          New Message
        </h3>
        
        <div class="space-y-4">
          <UFormField label="Recipient" required>
            <USelectMenu
              v-model="newMessageForm.recipient"
              :options="availableContacts"
              placeholder="Select a contact"
              searchable
            />
          </UFormField>
          
          <UFormField label="Message" required>
            <UTextarea
              v-model="newMessageForm.content"
              placeholder="Type your message..."
              :rows="4"
            />
          </UFormField>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton
            variant="ghost"
            @click="showNewMessageModal = false"
          >
            Cancel
          </UButton>
          <UButton
            @click="createNewConversation"
            :loading="isCreatingConversation"
            :disabled="!newMessageForm.recipient || !newMessageForm.content.trim()"
          >
            Send Message
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const route = useRoute()
const toast = useToast()

const searchQuery = ref('')
const selectedConversation = ref(null)
const newMessage = ref('')
const isSending = ref(false)
const isTyping = ref(false)
const showNewMessageModal = ref(false)
const isCreatingConversation = ref(false)

const messagesContainer = ref(null)

const newMessageForm = reactive({
  recipient: null,
  content: ''
})

// Mock data - replace with actual API calls
const conversations = ref([
  {
    id: '1',
    otherParticipant: {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      role: 'mentor'
    },
    lastMessage: {
      id: '1',
      content: 'Looking forward to our session tomorrow!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: '2'
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    otherParticipant: {
      id: '3',
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'mentor'
    },
    lastMessage: {
      id: '2',
      content: 'Great session today! Here are the resources I mentioned.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      senderId: '3'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
])

const messages = ref([
  {
    id: '1',
    conversationId: '1',
    senderId: '2',
    content: 'Hi! I\'m excited about our upcoming session. Do you have any specific topics you\'d like to focus on?',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '2',
    conversationId: '1',
    senderId: user.value?.id,
    content: 'Hi Sarah! I\'d love to discuss career growth strategies and how to transition into a senior role.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '2',
    content: 'Perfect! I have some great insights to share about that. We can also talk about building leadership skills.',
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '4',
    conversationId: '1',
    senderId: '2',
    content: 'Looking forward to our session tomorrow!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false
  }
])

const availableContacts = [
  { label: 'Sarah Chen', value: '2' },
  { label: 'Marcus Johnson', value: '3' },
  { label: 'Elena Rodriguez', value: '4' }
]

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  return conversations.value.filter(conv =>
    conv.otherParticipant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectedConversationMessages = computed(() => {
  if (!selectedConversation.value) return []
  
  return messages.value
    .filter(msg => msg.conversationId === selectedConversation.value.id)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
})

const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  
  // Mark messages as read
  conversation.unreadCount = 0
  
  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return
  
  isSending.value = true
  
  try {
    const message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.value.id,
      senderId: user.value?.id,
      content: newMessage.value.trim(),
      timestamp: new Date(),
      isRead: false
    }
    
    // Add message to messages array
    messages.value.push(message)
    
    // Update conversation's last message
    selectedConversation.value.lastMessage = message
    selectedConversation.value.updatedAt = new Date()
    
    // Clear input
    newMessage.value = ''
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
    
    // Simulate typing indicator and response (for demo)
    setTimeout(() => {
      isTyping.value = true
      setTimeout(() => {
        isTyping.value = false
        
        const response = {
          id: (Date.now() + 1).toString(),
          conversationId: selectedConversation.value.id,
          senderId: selectedConversation.value.otherParticipant.id,
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: new Date(),
          isRead: false
        }
        
        messages.value.push(response)
        selectedConversation.value.lastMessage = response
        selectedConversation.value.unreadCount = 1
        
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
          }
        })
      }, 2000)
    }, 1000)
    
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to send message. Please try again.',
      color: 'red'
    })
  } finally {
    isSending.value = false
  }
}

const handleTyping = () => {
  // Simulate typing indicator logic
}

const startVideoCall = () => {
  toast.add({
    title: 'Video Call',
    description: 'Video calling feature will be available soon.',
    color: 'blue'
  })
}

const startAudioCall = () => {
  toast.add({
    title: 'Audio Call',
    description: 'Audio calling feature will be available soon.',
    color: 'blue'
  })
}

const createNewConversation = async () => {
  isCreatingConversation.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create new conversation
    const newConv = {
      id: Date.now().toString(),
      otherParticipant: {
        id: newMessageForm.recipient,
        name: availableContacts.find(c => c.value === newMessageForm.recipient)?.label,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'mentor'
      },
      lastMessage: {
        id: Date.now().toString(),
        content: newMessageForm.content,
        timestamp: new Date(),
        senderId: user.value?.id
      },
      unreadCount: 0,
      updatedAt: new Date()
    }
    
    conversations.value.unshift(newConv)
    selectConversation(newConv)
    
    // Add the message
    messages.value.push({
      id: Date.now().toString(),
      conversationId: newConv.id,
      senderId: user.value?.id,
      content: newMessageForm.content,
      timestamp: new Date(),
      isRead: false
    })
    
    toast.add({
      title: 'Message Sent',
      description: 'Your message has been sent successfully.',
      color: 'green'
    })
    
    showNewMessageModal.value = false
    newMessageForm.recipient = null
    newMessageForm.content = ''
    
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to send message. Please try again.',
      color: 'red'
    })
  } finally {
    isCreatingConversation.value = false
  }
}

const formatMessageTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else {
    return 'Just now'
  }
}

// Handle URL parameters for direct messaging
onMounted(() => {
  const mentorId = route.query.mentor
  const userId = route.query.user
  
  if (mentorId || userId) {
    const targetId = mentorId || userId
    const existingConv = conversations.value.find(
      conv => conv.otherParticipant.id === targetId
    )
    
    if (existingConv) {
      selectConversation(existingConv)
    } else {
      // Open new message modal with pre-selected recipient
      newMessageForm.recipient = targetId
      showNewMessageModal.value = true
    }
  }
})
</script>
