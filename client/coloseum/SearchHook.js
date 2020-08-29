import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'
import qs from 'query-string'

export default ({initial, schema}) => {
  const useSearch = () => {
    const { search } = useLocation()
    const data = {
      ...initial,
      ...qs.parse(search.replace(/^\?/,''))
    }
    return {
      data,
      search,
    }
  }

  function SearchForm({schema}) {
    const {data} = useSearch()
    const history = useHistory()
    const onChange = (formData) => history.push('?'+qs.stringify(formData))
    return (
      <Form
        formData={data}
        onChange={onChange}
        autoSubmit={true}
        customButton={true}
        schema={schema}
      />
    )
  }
  return {
    useSearch,
    SearchForm,
  }
}
