import * as React from 'react'
import Head from 'next/head'

const MainLayout = (props: any) => (
  <div>
    <Head>
      <title>React Tweets</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div>
      <div className="mainLayout">{props.children}</div>
    </div>
  </div>
)

export default MainLayout
