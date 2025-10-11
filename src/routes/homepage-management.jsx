import { createFileRoute } from '@tanstack/react-router'
import HomePageManagement from '../pages/HomePageManagement'

export const Route = createFileRoute('/homepage-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HomePageManagement />
}
