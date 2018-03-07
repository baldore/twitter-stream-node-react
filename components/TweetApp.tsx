import * as React from 'react'
import Tweets from './Tweets'
import Loader from './Loader'
import NotificationBar from './NotificationBar'

const TweetsApp = () => (
  <div className="tweets-app">
    <Tweets />
    <Loader />
    <NotificationBar />

    {/* <Tweets tweets={this.state.tweets} />
    <Loader paging={this.state.paging} />
    <NotificationBar
      count={this.state.count}
      onShowNewTweets={this.showNewTweets}
    /> */}
  </div>
)

export default TweetsApp
