<template>
  <div>
    <h1>Coloseum</h1>
    <div>
      <button @click="next" :class="css.button()">Next</button>
      <button @click="restart" :class="css.button.danger()">Restart</button>
    </div>
    <render-board v-if="board" :board="board" :hash="hash" />
  </div>
</template>

<script>
import css from '@unrest/css'
import RenderBoard from '@/components/RenderBoard'
import Board from 'tw/Board'

const parseBoard = (s) => {
  const [W, H] = s.split('x').map(Number)
  return { W, H }
}

export default {
  components: { RenderBoard },
  __route: {
    path: '/coloseum/:board/:pieces/',
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
    next() {
      this.board.game.nextTurn()
      this.hash = this.board.game.turn.toString() // triggers update
    },
    restart() {
      const { params } = this.$route
      const options = parseBoard(params.board)
      options.pieces = params.pieces
      const board = (this.board = new Board(options))
      this.hash = board.game.turn.toString() // triggers update
      const all_bats = !options.pieces.replace(/(bat)/g, '').replace(/(\+|,)/g, '')
      if (all_bats) {
        board.entities.sound[board.geo.CENTER] = 0
      }
    },
  },
}
</script>
