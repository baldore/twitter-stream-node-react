import * as React from 'react'
import * as io from 'socket.io-client'
import rxjsConfig from 'recompose/rxjsObservableConfig'
import { Observable, Subject } from 'rxjs'
import {
  setObservableConfig,
  componentFromStream,
  Subscribable,
  createEventHandler,
  mapPropsStream,
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

function getScrollHitsBottomStream() {
  const scroll$ = Observable.fromEvent(window, 'scroll')
  const improvedScroll$ = Observable.merge(scroll$.throttleTime(80), scroll$.debounceTime(80))

  const scrollHitsBottom$ = improvedScroll$.filter(() => {
    const { scrollHeight, clientHeight } = document.documentElement
    return scrollHeight <= clientHeight + window.scrollY
  })

  return scrollHitsBottom$
}

const tweetsDecorator = mapPropsStream<TweetsAppProps, TweetsAppStreamProps>(
  (propsStream: Subscribable<TweetsAppProps>) => {
    const props$ = Observable.from(propsStream)
    const initialTweets$ = props$.map(props => props.tweets)

    const socket = io('http://localhost:3000')
    const newTweets$ = Observable.fromEvent<Tweet>(socket, socketEvents.tweet)

    const showAllTweetsEvent = createEventHandler()
    const showAllTweetsHandler = showAllTweetsEvent.handler
    const showAllTweets$ = Observable.from(showAllTweetsEvent.stream)

    const oldTweetsLoadedSubject = new Subject()

    const allTweets$: Observable<Tweet[]> = initialTweets$.switchMap(initialTweets =>
      Observable.merge(
        showAllTweets$.mapTo({ type: 'show-all-tweets' }),
        newTweets$.map(tweet => ({ type: 'add-tweet', tweet })),
        oldTweetsLoadedSubject.map(tweets => ({ type: 'add-old-tweets', tweets })),
      )
        .scan((tweets, action: any) => {
          if (action.type === 'show-all-tweets') {
            return tweets.map(tweet => ({ ...tweet, active: true }))
          }

          if (action.type === 'add-tweet') {
            return [action.tweet, ...tweets]
          }

          if (action.type === 'add-old-tweets') {
            return [...tweets, ...action.tweets]
          }

          return tweets
        }, initialTweets)
        .startWith(initialTweets),
    )

    const scrollHitsBottom$ = (process as any).browser
      ? getScrollHitsBottomStream()
      : Observable.never()

    const loadOldTweets$ = scrollHitsBottom$
      .withLatestFrom(allTweets$, (_, tweets) => tweets.length)
      .switchMap(skip =>
        Observable.ajax(`http://localhost:3000/api/tweets/0/${skip}`).map(
          ({ response }) => response.tweets,
        ),
      )

    loadOldTweets$.subscribe(oldTweetsLoadedSubject)

    const finalProps$ = allTweets$.map<Tweet[], TweetsAppProps>(tweets => ({
      tweets,
      onShowNewTweets: showAllTweetsHandler,
      count: tweets.filter(tweet => tweet.active === false).length,
    }))

    return finalProps$
  },
)

const TweetsApp = (props: TweetsAppProps) => (
  <div className="tweets-app">
    <Tweets tweets={props.tweets} />
    <NotificationBar count={props.count} onShowNewTweets={props.onShowNewTweets} />
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

export default tweetsDecorator(TweetsApp)
