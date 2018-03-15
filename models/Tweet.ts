import * as mongoose from 'mongoose'
import { Tweet } from '../types/tweets'

const schema = new mongoose.Schema({
  twid: String,
  active: String,
  author: String,
  avatar: String,
  body: String,
  date: Date,
  screenname: String,
})

const Tweet = mongoose.model('Tweet', schema)

export const getTweets = async function(page: number, skip: number): Promise<Tweet[]> {
  const start = page * 10 + skip

  const tweets: Tweet[] = await Tweet.find({}, null, { skip: start, limit: 10 })
    .sort({ date: 'desc' })
    .lean()
    .exec()

  const processedTweets = tweets.map(tweet => ({ ...tweet, active: true }))

  return processedTweets
}

export default Tweet
