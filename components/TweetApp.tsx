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
  (propsStream: Subscribable<TweetsAppProps>) => {
    const socket = io('http://localhost:3000')
    const newTweets$ = Observable.fromEvent<Tweet>(socket, socketEvents.tweet)
      // To see that they actually appear on screen
      .map(tweet => ({ ...tweet, active: true }))

    const props$ = Observable.from(propsStream)
    const initialTweets$ = props$.map(props => props.tweets)

    const combinedTweets$ = initialTweets$
      .switchMap(initialTweets =>
        newTweets$
          .scan((tweets, newTweet) => [newTweet, ...tweets], initialTweets)
          .startWith(initialTweets),
      )
      .map(tweets => ({ tweets }))

    return combinedTweets$.map(props => <TweetsApp {...props} />)
  },
)

const log = (x: any) => {
  console.log(x)
  return x
}

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
