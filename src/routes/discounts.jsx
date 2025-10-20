import { createFileRoute } from '@tanstack/react-router'
import Discounts from '../pages/Discounts'

export const Route = createFileRoute('/discounts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Discounts/>
}
