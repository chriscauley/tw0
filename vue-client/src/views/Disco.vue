<template>
  <div>
    <h1>Disco</h1>
    <div class="flex">
      <settings-popper />
      <!-- <button class="btn btn-primary" @click="replay">Replay</button> -->
    </div>
    <render-board v-if="board" :board="board" :hash="hash" :queue="queue" />
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
      queue: [],
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
      options.mode = 'disco'
      this.board = new Board(options)
      this.sync()
    },
    sync() {
      this.hash = this.board.game.turn.toString()
    },
    playerExec(keys) {
      // TODO hate this name
      this.board.game.playerExec(keys, this.sync)
      this.queue = []
    },
    keydown(e) {
      if (e.key.includes('Arrow') || e.key === ' ') {
        e.preventDefault()
        if (e.shiftKey) {
          this.queue.push(e.key)
          if (this.queue.length === 1) {
            this.queue.push(e.key)
          }
          while (this.queue.length > 2) {
            this.queue.shift()
          }
        } else {
          this.playerExec([e.key])
        }
      } else if (e.key === 'r' && !e.ctrlKey) {
        e.preventDefault()
        this.restart()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        this.queue = []
      }
    },
    keyup(e) {
      if (e.key === 'Shift' && this.queue.length) {
        this.playerExec(this.queue)
      }
    },
  },
}
</script>
