import { createFileRoute } from '@tanstack/react-router'
import AddFreeContent from '../pages/AddFreeContent'

export const Route = createFileRoute('/add-free-content')({
  component: AddFreeContent,
})