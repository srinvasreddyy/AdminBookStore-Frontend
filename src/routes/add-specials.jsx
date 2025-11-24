import { createFileRoute } from '@tanstack/react-router'
import AddSpecial from '../pages/AddSpecial'

export const Route = createFileRoute('/add-specials')({
  component: AddSpecial,
})