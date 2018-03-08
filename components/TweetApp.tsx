import * as React from 'react'
import Tweets from './Tweets'
import Loader from './Loader'
import NotificationBar from './NotificationBar'
import { Tweet } from '../types/tweets'

interface TweetsAppProps {
  tweets: Tweet[]
}

class TweetsApp extends React.Component<TweetsAppProps> {
  render() {
    return (
      <div className="tweets-app">
        <Tweets tweets={this.props.tweets} />
        {/* <Loader />
        <NotificationBar /> */}

        {/* <Tweets tweets={this.state.tweets} />
    <Loader paging={this.state.paging} />
    <NotificationBar
      count={this.state.count}
      onShowNewTweets={this.showNewTweets}
    /> */}
      </div>
    )
  }
}

export default TweetsApp
