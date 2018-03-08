import * as React from 'react'
import MainLayout from '../layouts/MainLayout'
import TweetsApp from '../components/TweetApp'
import { PageComponent } from '../types/pages'
import { Tweet } from '../types/tweets'
import { getTweets } from '../models/Tweet'

interface IndexPageProps {
  tweets: Tweet[]
}

const Index: PageComponent = ({ tweets }: IndexPageProps) => (
  <MainLayout>
    <TweetsApp initialTweets={tweets} />
  </MainLayout>
)

Index.getInitialProps = async ({ req }): Promise<IndexPageProps> => {
  const response = await fetch(`http://${req.headers.host}/api/tweets/0/0`)
  const { tweets } = await response.json()

  return { tweets }
}

export default Index
