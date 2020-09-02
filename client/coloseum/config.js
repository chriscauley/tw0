import React from 'react'
import ConfigHook from '@unrest/react-config-hook'
import css from '@unrest/css'
import { useSelect } from '@unrest/core'

const schema = {
  type: 'object',
  properties: {
    css: { type: 'boolean' },
    text: { type: 'boolean' },
    extra: {
      type: 'string',
      enum: [
        'off',
        'sound',
        'sound_cache',
        'team1_dfill',
        'team1_id_fill',
        'team1_fill',
        'team2_target',
        // 'team2_dfill',
        // 'team2_id_fill',
        // 'team2_fill',
        // 'team2_target_fill',
      ],
    },
  },
}

const uiSchema = {
  extra: {
    'ui:widget': 'radio',
  },
}

const initial = {
  formData: { css: true, text: false, extra_layers: [] },
}

const { useConfig, Form } = ConfigHook('renderer-config', { schema, uiSchema, initial })

const ConfigLink = () => {
  const { open, toggle, childRef } = useSelect()
  if (open) {
    return (
      <div className={css.modal.outer()}>
        <div className={css.modal.mask()} />
        <div className={css.modal.content()} ref={childRef}>
          <Form onSubmit={() => setTimeout(toggle)} />
        </div>
      </div>
    )
  }
  return (
    <div className="m-4 fixed bottom-0 right-0 cursor-pointer text-blue-500">
      <i className="fa fa-gear text-xl" onClick={toggle} />
    </div>
  )
}

export default {
  Link: ConfigLink,
  use: useConfig,
}
