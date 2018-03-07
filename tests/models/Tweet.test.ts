import Tweet from '../../models/Tweet'

describe('Tweet - getTweets', () => {
  let tweetThisMock: any
  const originalTweets = [{ id: 1, active: false }, { id: 2, active: false }]
  const { getTweets } = Tweet.schema.statics

  beforeEach(() => {
    tweetThisMock = {
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockReturnValue(Promise.resolve(originalTweets)),
    }

    Tweet.find = jest.fn().mockReturnValue(tweetThisMock)
  })

  it('should not skip if values are 0', async () => {
    const tweets = await getTweets(0, 0)
    expect(Tweet.find).toHaveBeenCalledWith({}, { skip: 0, limit: 10 })
  })

  it('should skip by 10 per each page', async () => {
    await getTweets(1, 0)
    expect(Tweet.find).toHaveBeenLastCalledWith({}, { skip: 10, limit: 10 })

    await getTweets(2, 0)
    expect(Tweet.find).toHaveBeenLastCalledWith({}, { skip: 20, limit: 10 })

    await getTweets(5, 0)
    expect(Tweet.find).toHaveBeenLastCalledWith({}, { skip: 50, limit: 10 })
  })
})
