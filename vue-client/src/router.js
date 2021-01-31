import { createRouter, createWebHistory } from 'vue-router'

import views from '@/views'

const routes = []

Object.entries(views).forEach(([component_name, Component]) => {
  const route = {
    name: component_name.toLowerCase(),
    path: `/${component_name.toLowerCase()}`,
    component: Component,
  }
  Object.assign(route, Component.__route)
  routes.push(route)
})

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
