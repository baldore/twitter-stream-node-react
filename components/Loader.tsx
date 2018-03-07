import * as React from 'react'

interface LoaderProps {
  paging: boolean
}

const Loader = (props: LoaderProps) => (
  <div className={'loader ' + (props.paging ? 'active' : '')}>
    <img src="svg/loader.svg" />
  </div>
)

export default Loader
