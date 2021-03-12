export default (pieces) => {
  if (typeof pieces === 'string') {
    if (!pieces.includes('+')) {
      pieces += '+' + pieces
    }
    const out = { 1: [], 2: [] }
    pieces.split('+').forEach((s, i_team) => {
      const team = i_team + 1
      s.split(',').forEach((s2) => {
        if (!s2) {
          return
        }
        if (!s2.match(/^\d+x/)) {
          s2 = '1x' + s2
        }
        const [_, count, type] = s2.match(/^(\d+)x(.+)/)
        let i = parseInt(count)
        while (i--) {
          out[team].push(type)
        }
      })
    })
    pieces = out
  }
  return pieces
}
