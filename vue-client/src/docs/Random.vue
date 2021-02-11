<template>
  <div>
    This shows that a stream of range(n).map(()=>random()) is non-periodic.
    <div v-if="chart" class="chart flex items-end" style="height: 100px">
      <div class="w-4 border" :style="style" v-for="(style, i) in chart" :key="i" />
    </div>
    <table class="table">
      <tbody>
        <tr v-for="row in rows" :key="row[0]" @mouseover="makeChart(row)">
          <td v-for="(cell, i) in row" :key="i">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { range } from 'lodash'
import random from 'tw/random'
const MAX = 40

export default {
  __route: {
    path: '/docs/Random/',
  },
  data() {
    return { chart: null }
  },
  computed: {
    rows() {
      const rows = []
      range(2, MAX).forEach((m) => {
        rows.push([`sm(x)%${m}`, ...range(1, MAX).map((x) => random(500 + x) % m)])
      })
      return rows
    },
  },
  methods: {
    makeChart(row) {
      const max = Math.max(...row.slice(1))
      const styles = row.slice(1).map((i) => `height: ${(100 * i) / max}%`)
      this.chart = styles
    },
  },
}
</script>
