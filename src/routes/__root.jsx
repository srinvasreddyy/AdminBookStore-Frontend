import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Layout from '../components/Layout'
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Layout>
         <Outlet />
      </Layout>
     
    </React.Fragment>
  )
}
