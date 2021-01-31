<template>
  <div>
    <h1>Coloseum</h1>
    <render-board :board="board" />
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
    }
  },
}
</script>
