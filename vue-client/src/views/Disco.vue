<template>
  <div>
    <h1>Disco</h1>
    <div class="flex">
      <settings-popper />
      <!-- <button class="btn btn-primary" @click="replay">Replay</button> -->
    </div>
    <render-board v-if="board" :board="board" :hash="hash" />
  </div>
</template>

<script>
import css from '@unrest/css'
import Board from 'tw/Board'
import RenderBoard from '@/components/RenderBoard'
import EventMixin from '@/EventMixin'
import SettingsPopper from '@/components/SettingsPopper'

const parseBoard = (s) => {
  const [W, H] = s.split('x').map(Number)
  return { W, H }
}

export default {
  components: { RenderBoard, SettingsPopper },
  mixins: [EventMixin],
  __route: {
    path: '/disco/:board/:pieces/',
  },
  data() {
    return {
      board: null,
      hash: null,
      css,
    }
  },
  mounted() {
    this.restart()
  },
  methods: {
    restart() {
      const { params } = this.$route
      const options = parseBoard(params.board)
      options.pieces = '+' + params.pieces
      options.player = 1
      this.board = new Board(options)
      this.sync()
    },
    sync() {
      this.hash = this.board.game.turn.toString()
    },
    keydown(e) {
      if (e.key.includes('Arrow') || e.key === ' ') {
        e.preventDefault()
        this.board.game.playerExec([e.key], this.sync)
      } else if (e.key === 'r' && !e.ctrlKey) {
        e.preventDefault()
        this.restart()
      }
    },
  },
}
</script>
