<template>
  <NuxtLayout name="admin">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="summary in paymentSummary"
        :key="summary.name"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon
              :name="summary.icon"
              :class="['w-8 h-8', `text-${summary.color}-500`]"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ summary.name }}
              </dt>
              <dd class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ summary.value }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1 max-w-lg">
          <UInput
            v-model="searchQuery"
            placeholder="Search payments..."
            icon="heroicons:magnifying-glass"
          />
        </div>
        
        <div class="flex items-center space-x-4">
          <USelect
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="All Status"
          />
          
          <USelect
            v-model="selectedTimeframe"
            :options="timeframeOptions"
            placeholder="All Time"
          />
          
          <UButton
            icon="heroicons:arrow-down-tray"
            variant="outline"
            @click="exportPayments"
          >
            Export
          </UButton>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Payment Transactions ({{ filteredPayments.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaction
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Session
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Participants
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="payment in paginatedPayments" :key="payment.id">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.transactionId }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ payment.paymentMethod }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.sessionTitle }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(payment.sessionDate) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="flex -space-x-2">
                    <UAvatar
                      :src="payment.mentor.avatar"
                      :alt="payment.mentor.name"
                      size="sm"
                    />
                    <UAvatar
                      :src="payment.mentee.avatar"
                      :alt="payment.mentee.name"
                      size="sm"
                    />
                  </div>
                  <div>
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ payment.mentor.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ payment.mentee.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  ${{ payment.amount }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Fee: ${{ payment.platformFee }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="getPaymentStatusColor(payment.status)"
                  variant="soft"
                >
                  {{ payment.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(payment.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getPaymentActions(payment)">
                  <UButton
                    variant="ghost"
                    icon="heroicons:ellipsis-horizontal"
                  />
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredPayments.length) }} of {{ filteredPayments.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <UButton
              variant="ghost"
              icon="heroicons:chevron-left"
              :disabled="currentPage === 1"
              @click="currentPage--"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <UButton
              variant="ghost"
              icon="heroicons:chevron-right"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <UModal v-model:open="showDetailsModal" :title="`Payment ${selectedPayment?.transactionId}`">
      <template #body>
        <div v-if="selectedPayment" class="space-y-6">
          <!-- Transaction Info -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Transaction Details</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedPayment.transactionId }}</p>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedPayment.paymentMethod }}</p>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Amount:</span>
                <p class="font-medium text-gray-900 dark:text-white">${{ selectedPayment.amount }}</p>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Platform Fee:</span>
                <p class="font-medium text-gray-900 dark:text-white">${{ selectedPayment.platformFee }}</p>
              </div>
            </div>
          </div>

          <!-- Session Info -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Session Information</h4>
            <div class="space-y-2 text-sm">
              <p><span class="text-gray-600 dark:text-gray-400">Title:</span> {{ selectedPayment.sessionTitle }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Date:</span> {{ formatDate(selectedPayment.sessionDate) }}</p>
              <p><span class="text-gray-600 dark:text-gray-400">Duration:</span> {{ selectedPayment.duration }}h</p>
            </div>
          </div>

          <!-- Participants -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Participants</h4>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="selectedPayment.mentor.avatar"
                  :alt="selectedPayment.mentor.name"
                  size="md"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedPayment.mentor.name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mentor</p>
                </div>
              </div>
              <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-400" />
              <div class="flex items-center space-x-3">
                <UAvatar
                  :src="selectedPayment.mentee.avatar"
                  :alt="selectedPayment.mentee.name"
                  size="md"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedPayment.mentee.name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Mentee</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div v-if="selectedPayment.statusHistory">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Status History</h4>
            <div class="space-y-3">
              <div
                v-for="status in selectedPayment.statusHistory"
                :key="status.timestamp.getTime()"
                class="flex items-center space-x-3"
              >
                <div
                  :class="[
                    'w-2 h-2 rounded-full',
                    status.status === 'completed' ? 'bg-green-500' :
                    status.status === 'processing' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  ]"
                />
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-white">{{ status.status }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(status.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <template #footer="{ close }">
        <div class="flex justify-end space-x-3">
          <UButton variant="ghost" @click="close">Close</UButton>
          <UButton
            v-if="selectedPayment?.status === 'pending'"
            @click="processRefund(selectedPayment.id)"
          >
            Process Refund
          </UButton>
        </div>
      </template>
    </UModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

// Types
interface Participant {
  name: string
  avatar: string
}

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

interface PaymentStatusEntry {
  status: PaymentStatus
  timestamp: Date
}

interface Payment {
  id: string
  transactionId: string
  sessionTitle: string
  sessionDate: Date
  mentor: Participant
  mentee: Participant
  amount: number
  platformFee: number
  paymentMethod: string
  status: PaymentStatus
  duration: number
  createdAt: Date
  statusHistory?: PaymentStatusEntry[]
}

// State
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedTimeframe = ref('')
const currentPage = ref(1)
const pageSize = 15
const showDetailsModal = ref(false)
const selectedPayment = ref<Payment | null>(null)

// Mock data
const paymentSummary = ref([
  {
    name: 'Total Revenue',
    value: '$48,392',
    icon: 'heroicons:currency-dollar',
    color: 'green'
  },
  {
    name: 'This Month',
    value: '$12,847',
    icon: 'heroicons:calendar-days',
    color: 'blue'
  },
  {
    name: 'Platform Fees',
    value: '$4,839',
    icon: 'heroicons:receipt-percent',
    color: 'purple'
  },
  {
    name: 'Pending Payouts',
    value: '$2,156',
    icon: 'heroicons:clock',
    color: 'yellow'
  }
])

const payments = ref<Payment[]>([
  {
    id: 'PAY-001',
    transactionId: 'pi_1234567890',
    sessionTitle: 'Career Growth Discussion',
    sessionDate: new Date('2024-01-25'),
    mentor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    mentee: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    amount: 75,
    platformFee: 7.5,
    paymentMethod: 'Visa ****4242',
    status: 'completed',
    duration: 1,
    createdAt: new Date('2024-01-20'),
    statusHistory: [
      { status: 'pending', timestamp: new Date('2024-01-20T10:00:00') },
      { status: 'processing', timestamp: new Date('2024-01-20T10:01:00') },
      { status: 'completed', timestamp: new Date('2024-01-20T10:02:00') }
    ]
  },
  {
    id: 'PAY-002',
    transactionId: 'pi_0987654321',
    sessionTitle: 'Technical Interview Prep',
    sessionDate: new Date('2024-01-26'),
    mentor: {
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    mentee: {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    amount: 135,
    platformFee: 13.5,
    paymentMethod: 'Mastercard ****8888',
    status: 'pending',
    duration: 1.5,
    createdAt: new Date('2024-01-21'),
    statusHistory: [
      { status: 'pending', timestamp: new Date('2024-01-21T14:30:00') }
    ]
  },
  {
    id: 'PAY-003',
    transactionId: 'pi_1122334455',
    sessionTitle: 'UX Design Review',
    sessionDate: new Date('2024-01-24'),
    mentor: {
      name: 'Elena Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    mentee: {
      name: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    amount: 65,
    platformFee: 6.5,
    paymentMethod: 'PayPal',
    status: 'completed',
    duration: 1,
    createdAt: new Date('2024-01-19'),
    statusHistory: [
      { status: 'pending', timestamp: new Date('2024-01-19T09:15:00') },
      { status: 'processing', timestamp: new Date('2024-01-19T09:16:00') },
      { status: 'completed', timestamp: new Date('2024-01-19T09:17:00') }
    ]
  },
  {
    id: 'PAY-004',
    transactionId: 'pi_5566778899',
    sessionTitle: 'Startup Strategy Session',
    sessionDate: new Date('2024-01-27'),
    mentor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    mentee: {
      name: 'Alex Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    amount: 150,
    platformFee: 15,
    paymentMethod: 'Visa ****1234',
    status: 'refunded',
    duration: 2,
    createdAt: new Date('2024-01-22'),
    statusHistory: [
      { status: 'pending', timestamp: new Date('2024-01-22T11:00:00') },
      { status: 'processing', timestamp: new Date('2024-01-22T11:01:00') },
      { status: 'completed', timestamp: new Date('2024-01-22T11:02:00') },
      { status: 'refunded', timestamp: new Date('2024-01-23T16:30:00') }
    ]
  }
])

// Options
const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' }
]

const timeframeOptions = [
  { label: 'All Time', value: '' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'This year', value: '1y' }
]

// Computed
const filteredPayments = computed(() => {
  let filtered = payments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(payment =>
      payment.transactionId.toLowerCase().includes(query) ||
      payment.sessionTitle.toLowerCase().includes(query) ||
      payment.mentor.name.toLowerCase().includes(query) ||
      payment.mentee.name.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(payment => payment.status === selectedStatus.value)
  }

  if (selectedTimeframe.value) {
    const now = new Date()
    const timeframe = selectedTimeframe.value
    let cutoffDate = new Date()

    if (timeframe === '7d') cutoffDate.setDate(now.getDate() - 7)
    else if (timeframe === '30d') cutoffDate.setDate(now.getDate() - 30)
    else if (timeframe === '90d') cutoffDate.setDate(now.getDate() - 90)
    else if (timeframe === '1y') cutoffDate.setFullYear(now.getFullYear() - 1)

    filtered = filtered.filter(payment => payment.createdAt >= cutoffDate)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / pageSize))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPayments.value.slice(start, end)
})

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'pending': return 'warning'
    case 'processing': return 'info'
    case 'failed': return 'error'
    case 'refunded': return 'neutral'
    default: return 'neutral'
  }
}

const getPaymentActions = (payment: Payment) => [
  [{
    label: 'View Details',
    icon: 'heroicons:eye',
    click: () => {
      selectedPayment.value = payment
      showDetailsModal.value = true
    }
  }],
  [{
    label: 'Download Receipt',
    icon: 'heroicons:arrow-down-tray',
    click: () => downloadReceipt(payment)
  }],
  ...(payment.status === 'completed' ? [[{
    label: 'Process Refund',
    icon: 'heroicons:arrow-uturn-left',
    click: () => processRefund(payment.id)
  }]] : [])
]

const downloadReceipt = (payment: Payment) => {
  const receiptData = {
    transactionId: payment.transactionId,
    sessionTitle: payment.sessionTitle,
    mentor: payment.mentor.name,
    mentee: payment.mentee.name,
    amount: payment.amount,
    platformFee: payment.platformFee,
    date: formatDate(payment.createdAt),
    status: payment.status
  }

  const dataStr = JSON.stringify(receiptData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `receipt-${payment.transactionId}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const processRefund = (paymentId: string) => {
  if (confirm('Are you sure you want to process a refund for this payment?')) {
    const payment = payments.value.find(p => p.id === paymentId)
    if (payment) {
      payment.status = 'refunded'
      payment.statusHistory?.push({
        status: 'refunded',
        timestamp: new Date()
      })
      showDetailsModal.value = false
    }
  }
}

const exportPayments = () => {
  const csvData = filteredPayments.value.map(payment => ({
    'Transaction ID': payment.transactionId,
    'Session': payment.sessionTitle,
    'Mentor': payment.mentor.name,
    'Mentee': payment.mentee.name,
    'Amount': `$${payment.amount}`,
    'Platform Fee': `$${payment.platformFee}`,
    'Payment Method': payment.paymentMethod,
    'Status': payment.status,
    'Date': formatDate(payment.createdAt)
  }))

  if (csvData.length === 0) {
    alert('No payments to export for the current filters.')
    return
  }

  const headers = [
    'Transaction ID',
    'Session',
    'Mentor',
    'Mentee',
    'Amount',
    'Platform Fee',
    'Payment Method',
    'Status',
    'Date'
  ]

  const headerLine = headers.join(',')
  const rows = csvData
    .map(row => headers.map(h => (row as Record<string, string>)[h]).join(','))
    .join('\n')
  const csv = `${headerLine}\n${rows}`

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// SEO
useSeoMeta({
  title: 'Payment Management - Admin Dashboard',
  description: 'Track payments and revenue'
})
</script>
