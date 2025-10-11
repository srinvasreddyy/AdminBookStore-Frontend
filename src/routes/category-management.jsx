import { createFileRoute } from '@tanstack/react-router'
import CategoryManagement from '../pages/CategoryManagement'

export const Route = createFileRoute('/category-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CategoryManagement/>
}
