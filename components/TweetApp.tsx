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
  onShowNewTweets() {},
}

interface TweetsAppStreamProps {
  tweets: Tweet[]
}

const TweetsAppStream = componentFromStream<TweetsAppStreamProps>(
  (propsStream: Subscribable<TweetsAppProps>) => {
    const socket = io('http://localhost:3000')
    const newTweets$ = Observable.fromEvent<Tweet>(socket, socketEvents.tweet)
    const props$ = Observable.from(propsStream)

    const showAllTweetsEvent = createEventHandler()
    const showAllTweetsHandler = showAllTweetsEvent.handler
    const showAllTweets$ = Observable.from(showAllTweetsEvent.stream)

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

    const initialProps = {
      ...initialState,
      onShowNewTweets: showAllTweetsHandler,
    }

    const finalProps$ = Observable.merge(
      updateTweetsAction$,
      updateCountAction$,
    ).scan(tweetsAppReducer, initialProps)

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
