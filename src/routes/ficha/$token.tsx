import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ficha/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ficha/$token"!</div>
}
