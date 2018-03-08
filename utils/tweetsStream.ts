import * as config from '../config'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Tweet as TweetType } from '../types/tweets'
import Tweet from '../models/Tweet'
import * as socketIO from 'socket.io'
import { Socket } from 'dgram'

const twitter = require('ntwitter')
const twitterInstance = new twitter(config.twitter)

const tweetsInitialStream$: Observable<any> = Observable.create(
  (observer: any) => {
    twitterInstance.stream(
      'statuses/filter',
      { track: 'scotch_io, #scotchio, #foobarbaz' },
      function(stream: any) {
        observer.next(stream)
      },
    )
  },
)

const tweets$ = tweetsInitialStream$.flatMap(stream =>
  Observable.fromEvent(stream, 'data'),
)

export function setupTweetsStreaming(io: SocketIO.Server) {
  tweets$.subscribe(async (data: any) => {
    if (!data['user']) return

    const tweet: TweetType = {
      twid: data['id_str'],
      active: false,
      author: data['user']['name'],
      avatar: data['user']['profile_image_url'],
      body: data['text'],
      date: data['created_at'],
      screenname: data['user']['screen_name'],
    }

    const tweetEntry = new Tweet(tweet)
    await tweetEntry.save()
    io.emit('tweet', tweet)
  })
}
