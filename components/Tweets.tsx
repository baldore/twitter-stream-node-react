import * as React from 'react'
import TweetComponent from './Tweet'
import { Tweet } from '../types/tweets'

const getTweets = (tweets: any[] = []) =>
  tweets.map(tweet => <TweetComponent key={tweet.twid} tweet={tweet} />)

interface TweetsProps {
  tweets: Tweet[]
}

const Tweets = (props: TweetsProps) => (
  <ul className="tweets">{getTweets(props.tweets)}</ul>
)

export default Tweets
