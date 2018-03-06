import * as mongoose from 'mongoose'

const schema = new mongoose.Schema({
  twid: String,
  active: Boolean,
  author: String,
  avatar: String,
  body: String,
  date: Date,
  screenname: String,
})

const Tweet = mongoose.model('Tweet', schema)

schema.statics.getTweets = async function(page: number, skip: number) {
  const start = page * 10 + skip * 1

  const tweets = await Tweet.find({}, { skip: start, limit: 10 })
    .sort({ date: 'desc' })
    .exec()

  const processedTweets = tweets.map(tweet => ({ ...tweet, active: true }))

  return processedTweets
}

export default Tweet
