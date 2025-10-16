import * as React from 'react'
import { Outlet, createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  const isLoginPage = location.pathname === '/login'

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated and not on login page
  if (!isAuthenticated && !isLoginPage) {
    navigate({ to: '/login', replace: true })
    return null
  }

  // Redirect to dashboard if authenticated and on login page
  if (isAuthenticated && isLoginPage) {
    navigate({ to: '/', replace: true })
    return null
  }

  return (
    <React.Fragment>
      {isLoginPage ? (
        <Outlet />  // no layout for login page
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
    </React.Fragment>
  )
}
