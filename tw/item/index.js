import weapon from './weapon'
import consumable from './consumable'
import assert from 'assert'
import { unslugify } from 'tw/utils'
// import generators from './generators'

const newItem = (type) => ({ type, _type: Item[type]})

const Item = {
  SLOTS: {},
  ALL: [],
  TYPES: [],
  newItem,
}

const register = slots => Object.entries(slots).forEach(
  ([slot_name, slot]) => {
    Item.SLOTS[slot_name] = slot
    const slot_items = []
    const slot_types = []
    Object.entries(slot).forEach(([item_type, item]) => {
      assert(!Item[item_type], `Item matching type "${item_type}" already registered`)
      item.type = item_type
      item.slot = slot_name
      item.sprite = item.sprite || item_type
      item.title = item.title || unslugify(item.type)
      slot_items.push(item)
      slot_types.push(item_type)
      Item[item_type] = item
      Item.ALL.push(item)
      Item.TYPES.push(item.type)
    })
    slot.ALL = slot_items
    slot.TYPES = slot_types
  }
)

Item.getDefaultEquipment = () => ({ weapon: newItem('knife') })

register({ consumable, weapon, })


export default Item
