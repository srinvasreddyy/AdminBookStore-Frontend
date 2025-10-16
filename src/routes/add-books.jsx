import { createFileRoute } from '@tanstack/react-router'
import AddBook from '../pages/AddBook'

export const Route = createFileRoute('/add-books')({
  validateSearch: (search) => ({
    id: search.id,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch()
  return <AddBook bookId={id} />
}
