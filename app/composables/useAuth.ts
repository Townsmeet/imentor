import { ref, reactive, computed, readonly, toRef } from 'vue'
import type { AuthState, User, UserRole } from '~/types'

export const useAuth = () => {
  const authState = useState<AuthState>('auth', (): AuthState => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
    hasCompletedOnboarding: false
  }))

  const login = async (email: string, password: string) => {
    authState.value.isLoading = true
    
    try {
      // Simulate API call - replace with actual API integration later
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API integration later
      // Determine role based on email for testing
      let role: UserRole = 'mentee'
      if (email.includes('mentor') || email.includes('teacher') || email.includes('coach')) role = 'mentor'
      if (email.includes('admin') || email.includes('administrator') || email.includes('root') || email.includes('super')) role = 'admin'
      
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      authState.value.user = mockUser
      authState.value.isAuthenticated = true
      // Keep onboarding state from storage if any, otherwise default false for mock
      let storedOnboarding = false
      if (process.client) {
        const stored = localStorage.getItem('has-completed-onboarding')
        storedOnboarding = stored === 'true'
      }
      authState.value.hasCompletedOnboarding = storedOnboarding
      
      // Store in localStorage for persistence
      if (process.client) {
        localStorage.setItem('auth-user', JSON.stringify(mockUser))
        localStorage.setItem('has-completed-onboarding', String(authState.value.hasCompletedOnboarding))
      }
      
      return { success: true, user: mockUser }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    } finally {
      authState.value.isLoading = false
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    role: UserRole
    firstName?: string
    lastName?: string
  }) => {
    authState.value.isLoading = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName ?? (userData.email.split('@')[0] || 'New'),
        lastName: userData.lastName ?? 'User',
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      authState.value.user = newUser
      authState.value.isAuthenticated = true
      authState.value.hasCompletedOnboarding = false
      
      if (process.client) {
        localStorage.setItem('auth-user', JSON.stringify(newUser))
        localStorage.setItem('has-completed-onboarding', 'false')
      }
      
      return { success: true, user: newUser, isNewUser: true }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    } finally {
      authState.value.isLoading = false
    }
  }

  const logout = () => {
    authState.value.user = null
    authState.value.isAuthenticated = false
    authState.value.hasCompletedOnboarding = false
    
    if (process.client) {
      localStorage.removeItem('auth-user')
      localStorage.removeItem('has-completed-onboarding')
    }
    
    navigateTo('/auth/login')
  }

  const initializeAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('auth-user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User
          authState.value.user = user
          authState.value.isAuthenticated = true
          const hasOnboarded = localStorage.getItem('has-completed-onboarding')
          authState.value.hasCompletedOnboarding = hasOnboarded === 'true'
        } catch (error) {
          localStorage.removeItem('auth-user')
          localStorage.removeItem('has-completed-onboarding')
        }
      }
    }
  }

  const requireAuth = () => {
    if (!authState.value.isAuthenticated) {
      navigateTo('/auth/login')
      return false
    }
    return true
  }

  const completeOnboarding = () => {
    authState.value.hasCompletedOnboarding = true
    if (process.client) {
      localStorage.setItem('has-completed-onboarding', 'true')
    }
  }

  const createAdminUser = () => {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@imentor.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    authState.value.user = adminUser
    authState.value.isAuthenticated = true
    authState.value.hasCompletedOnboarding = true
    
    if (process.client) {
      localStorage.setItem('auth-user', JSON.stringify(adminUser))
      localStorage.setItem('has-completed-onboarding', 'true')
    }
  }

  return {
    user: readonly(toRef(authState.value, 'user')),
    isAuthenticated: readonly(toRef(authState.value, 'isAuthenticated')),
    isLoading: readonly(toRef(authState.value, 'isLoading')),
    hasCompletedOnboarding: readonly(toRef(authState.value, 'hasCompletedOnboarding')),
    login,
    signup,
    logout,
    initializeAuth,
    requireAuth,
    completeOnboarding,
    createAdminUser
  }
}
