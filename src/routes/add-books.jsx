import { createFileRoute } from '@tanstack/react-router'
import AddBook from '../pages/AddBook'

export const Route = createFileRoute('/add-books')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddBook />
}
