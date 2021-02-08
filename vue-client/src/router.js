import { createRouter, createWebHistory } from 'vue-router'

import views from '@/views'
import sprite_views from '@/views/sprite'

import docs from '@/docs'

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
loadViews(docs)
loadViews(sprite_views)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
