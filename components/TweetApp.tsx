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
  count: number
}

type UpdateTweetsAction = {
  type: 'update-tweets'
  tweets: Tweet[]
}

type UpdateCountAction = {
  type: 'update-count'
  count: number
}

type TweetsAppActions = UpdateTweetsAction | UpdateCountAction

function tweetsAppReducer(
  state: TweetsAppProps,
  action: TweetsAppActions,
): TweetsAppProps {
  switch (action.type) {
    case 'update-tweets':
      return {
        ...state,
        tweets: action.tweets,
      }

    case 'update-count':
      return {
        ...state,
        count: action.count,
      }

    default:
      return state
  }
}

const initialState: TweetsAppProps = {
  count: 0,
  tweets: [],
}

const TweetsAppStream = componentFromStream(
  (propsStream: Subscribable<TweetsAppProps>) => {
    const socket = io('http://localhost:3000')
    const newTweets$ = Observable.fromEvent<Tweet>(socket, socketEvents.tweet)
    const props$ = Observable.from(propsStream)

    const initialTweets$ = props$.map(props => props.tweets)
    const allTweets$ = initialTweets$.switchMap(initialTweets =>
      newTweets$
        .scan((tweets, newTweet) => [newTweet, ...tweets], initialTweets)
        .startWith(initialTweets),
    )

    const updateTweetsAction$ = allTweets$.map<Tweet[], UpdateTweetsAction>(
      tweets => ({
        type: 'update-tweets',
        tweets,
      }),
    )

    const updateCountAction$ = allTweets$.map<Tweet[], UpdateCountAction>(
      tweets => ({
        type: 'update-count',
        count: tweets.filter(tweet => tweet.active === false).length,
      }),
    )

    const finalProps$ = Observable.merge(
      updateTweetsAction$,
      updateCountAction$,
    ).scan(tweetsAppReducer, initialState)

    return finalProps$.map(props => <TweetsApp {...props} />)
  },
)

const log = (x: any) => {
  console.log(x)
  return x
}

const TweetsApp = (props: TweetsAppProps) => (
  <div className="tweets-app">
    <Tweets tweets={props.tweets} />
    <NotificationBar count={props.count} onShowNewTweets={() => ({})} />
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
