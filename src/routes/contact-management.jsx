import { createFileRoute } from '@tanstack/react-router'
import ContactManagement from '../pages/ContactManagement'

export const Route = createFileRoute('/contact-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactManagement/>
}