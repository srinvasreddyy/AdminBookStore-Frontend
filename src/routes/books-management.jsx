import { createFileRoute } from '@tanstack/react-router'
import BookManagement from '../pages/BookManagement'  

export const Route = createFileRoute('/books-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BookManagement />
}
