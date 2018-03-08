import * as React from 'react'
import * as io from 'socket.io-client'
import rxjsConfig from 'recompose/rxjsObservableConfig'
import { Observable } from 'rxjs'
import {
  setObservableConfig,
  componentFromStream,
  Subscribable,
} from 'recompose'

import Tweets from './Tweets'
import Loader from './Loader'
import NotificationBar from './NotificationBar'
import { Tweet } from '../types/tweets'
import socketEvents from '../utils/tweetsEvents'

setObservableConfig(rxjsConfig)

interface TweetsAppProps {
  tweets: Tweet[]
}

const TweetsAppStream = componentFromStream(
  (props$: Subscribable<TweetsAppProps>) => {
    const socket = io('http://localhost:3000')

    socket.on(socketEvents.tweet, (tweet: Tweet) => {
      console.log('tweet', tweet)
    })

    return Observable.from(props$)
      .do(console.log)
      .map(props => <TweetsApp tweets={props.tweets} />)
  },
)

const TweetsApp = (props: TweetsAppProps) => (
  <div className="tweets-app">
    <Tweets tweets={props.tweets} />
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

export default TweetsAppStream
