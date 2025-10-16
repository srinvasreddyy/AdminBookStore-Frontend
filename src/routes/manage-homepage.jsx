import { createFileRoute } from '@tanstack/react-router'
import ManageHomePage from '../pages/ManageHomePage'

export const Route = createFileRoute('/manage-homepage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ManageHomePage />
}