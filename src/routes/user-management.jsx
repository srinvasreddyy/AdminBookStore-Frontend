
import { createFileRoute } from '@tanstack/react-router'
import UserManagement from '../pages/UserManagement'

export const Route = createFileRoute('/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserManagement />
}