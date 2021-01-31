import types from 'tw/piece/types'

let style_tag

const Sprite = (name) => {
  if (!Sprite.registry[name]) {
    if (!style_tag) {
      style_tag = document.createElement('style')
      document.head.appendChild(style_tag)
      style_tag.type = 'text/css'
    }
    const selector = `.sprite.sprite-${name}`
    style_tag.innerHTML += `${selector} { background-image: url("/static/sprites/${name}.png");}\n`
    const cls = name.replace('.', ' ')
    Sprite.registry[name] = 'sprite sprite-' + cls
  }
  return Sprite.registry[name]
}
Sprite.registry = {}

Object.entries(types).forEach(([name, type]) => {
  type.tasks && Sprite(name)
})

export default Sprite
