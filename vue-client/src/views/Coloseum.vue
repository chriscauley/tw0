<template>
  <div>
    <h1>Coloseum</h1>
    <pre>{{ board_text }}</pre>
  </div>
</template>

<script>
import Board from 'tw/Board'
import renderText from 'tw/render/text'

const parseBoard = (s) => {
  const [W, H] = s.split('x').map(Number)
  return { W, H }
}

export default {
  __route: {
    path: '/coloseum/:board/:pieces/',
  },
  data() {
    const { params } = this.$route
    const options = parseBoard(params.board)
    options.pieces = params.pieces
    const board = new Board(options)
    return { board_text: renderText(board) }
  },
}
</script>
