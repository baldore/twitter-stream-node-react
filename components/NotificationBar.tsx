import * as React from 'react'

interface NotificationBarProps {
  count: number
  onShowNewTweets: () => {}
}

const NotificationBar = (props: NotificationBarProps) => (
  <div className={'notification-bar' + (props.count > 0 ? ' active' : '')}>
    <p>
      There are {props.count} new tweets!{' '}
      <a href="#top" onClick={props.onShowNewTweets}>
        Click here to see them.
      </a>
    </p>
  </div>
)

export default NotificationBar
