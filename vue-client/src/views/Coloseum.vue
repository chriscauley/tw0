<template>
  <div>
    <h1>Coloseum</h1>
    <div>
      <button @click="next">Next</button>
      <button @click="restart">Restart</button>
    </div>
    <render-board :board="board" :hash="hash" />
  </div>
</template>

<script>
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
    const { params } = this.$route
    const options = parseBoard(params.board)
    options.pieces = params.pieces
    const board = new Board(options)
    return {
      board,
      hash: null,
    }
  },
  methods: {
    next() {
      this.board.game.nextTurn()
      this.hash = this.board.game.turn.toString() // triggers update
    },
    restart() {
      console.log('todo') // eslint-disable-line
    },
  },
}
</script>
