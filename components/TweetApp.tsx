import * as React from 'react'
import * as io from 'socket.io-client'
import rxjsConfig from 'recompose/rxjsObservableConfig'
import { Observable } from 'rxjs'
import {
  setObservableConfig,
  componentFromStream,
  Subscribable,
  createEventHandler,
} from 'recompose'

import Tweets from './Tweets'
import Loader from './Loader'
import NotificationBar from './NotificationBar'
import { Tweet } from '../types/tweets'
import socketEvents from '../utils/tweetsEvents'

setObservableConfig(rxjsConfig)

interface TweetsAppProps {
  tweets: Tweet[]
  count: number
  onShowNewTweets: (e: any) => void
}

interface TweetsAppStreamProps {
  tweets: Tweet[]
}

const initialState: TweetsAppProps = {
  count: 0,
  tweets: [],
  onShowNewTweets() {},
}

const TweetsAppStream = componentFromStream<TweetsAppStreamProps>(
  (propsStream: Subscribable<TweetsAppProps>) => {
    const props$ = Observable.from(propsStream)

    const socket = io('http://localhost:3000')
    const newTweets$ = Observable.fromEvent<Tweet>(socket, socketEvents.tweet)

    const showAllTweetsEvent = createEventHandler()
    const showAllTweetsHandler = showAllTweetsEvent.handler
    const showAllTweets$ = Observable.from(showAllTweetsEvent.stream)

    const initialTweets$ = props$.map(props => props.tweets)

    const allTweets$: Observable<Tweet[]> = initialTweets$.switchMap(
      initialTweets =>
        Observable.merge(
          showAllTweets$.mapTo({ type: 'show-all-tweets' }),
          newTweets$.map(tweet => ({ type: 'add-tweet', tweet })),
        ).scan((tweets, action: any) => {
          if (action.type === 'show-all-tweets') {
            return tweets.map(tweet => ({ ...tweet, active: true }))
          }

          if (action.type === 'add-tweet') {
            return [action.tweet, ...tweets]
          }

          return tweets
        }, initialTweets),
    )

    const finalProps$ = allTweets$.map<Tweet[], TweetsAppProps>(tweets => ({
      tweets,
      onShowNewTweets: showAllTweetsHandler,
      count: tweets.filter(tweet => tweet.active === false).length,
    }))

    return finalProps$.map(props => <TweetsApp {...props} />)
  },
)

const TweetsApp = (props: TweetsAppProps) => (
  <div className="tweets-app">
    <Tweets tweets={props.tweets} />
    <NotificationBar
      count={props.count}
      onShowNewTweets={props.onShowNewTweets}
    />
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
