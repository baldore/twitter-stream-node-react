import Tweet, { getTweets } from '../../models/Tweet'

describe('Tweet - getTweets', () => {
  let tweetThisMock: any
  const originalTweets = [{ id: 1, active: false }, { id: 2, active: false }]

  beforeEach(() => {
    tweetThisMock = {
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockReturnValue(Promise.resolve(originalTweets)),
    }

    Tweet.find = jest.fn().mockReturnValue(tweetThisMock)
  })

  it('should not skip if values are 0', async () => {
    const tweets = await getTweets(0, 0)
    expect(Tweet.find).toHaveBeenCalledWith({}, null, { skip: 0, limit: 10 })
  })

  it('should skip by 10 per each page', async () => {
    await getTweets(1, 0)
    expect(Tweet.find).toHaveBeenLastCalledWith({}, null, {
      skip: 10,
      limit: 10,
    })

    await getTweets(2, 0)
    expect(Tweet.find).toHaveBeenLastCalledWith({}, null, {
      skip: 20,
      limit: 10,
    })

    await getTweets(5, 0)
    expect(Tweet.find).toHaveBeenLastCalledWith({}, null, {
      skip: 50,
      limit: 10,
    })
  })

  it('should set all the tweets returned as active', async () => {
    const tweets = (await getTweets(1, 0)) as any[]
    tweets.forEach(tweet => expect(tweet.active).toBe(true))
  })
})
