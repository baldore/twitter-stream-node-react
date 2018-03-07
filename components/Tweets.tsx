import * as React from 'react'
import Tweet from './Tweet'

const getTweets = (tweets: any[] = []) =>
  tweets.map(tweet => <Tweet key={tweet.twid} tweet={tweet} />)

interface TweetsProps {
  tweets: any[]
}

const Tweets = (props: TweetsProps) => (
  <ul className="tweets">{getTweets(props.tweets)}</ul>
)

export default Tweets
