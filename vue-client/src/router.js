import { createRouter, createWebHistory } from 'vue-router'

import views from '@/views'
import { SpriteList } from '@/sprites'

const routes = []

const loadViews = (o) =>
  Object.entries(o).forEach(([component_name, Component]) => {
    const route = {
      name: component_name.toLowerCase(),
      path: `/${component_name.toLowerCase()}`,
      component: Component,
    }
    Object.assign(route, Component.__route)
    routes.push(route)
  })

loadViews(views)
loadViews({ SpriteList })

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
