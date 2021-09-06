import axios from 'axios';
import weather from 'weather-js';
import { Config } from './Config';

let cache: {data: any, date: Date} | undefined = undefined;
 
export class Util {

  public static print(message: string): void {

  }

  public static async NowPlaying() {
    if(!cache || (new Date().getTime() - cache.date.getTime()) >= Config.updateSpotify * 1000) {
      let response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${Config.lastUsername}&api_key=${Config.lastToken}&format=json`);
      if(response.data && response.data.recenttracks) {
        if(response.data.recenttracks.track) {
          let nowplaying = response.data.recenttracks.track[0]['@attr'];
          if(nowplaying) {
            nowplaying = nowplaying.nowplaying;
          }
          if(nowplaying == 'true') {
            let song = response.data.recenttracks.track[0];
            cache = { data: song, date: new Date() };
            return song;
          } else {
            return undefined;
          }
        }
      }
    } else {
      return cache.data;
    }
  }

  public static Weather(): Promise<any | undefined> {
    return new Promise((resolve) => {
      weather.find({
        search: Config.location, degreeType: Config.degreeType
      }, (err: Error, data: any) => {
        if(err) return resolve(undefined);
        return resolve(data[0].current);
      })
    })
  }

  public static dots(string: string, length: number) {
    if (string.length > length) return string.substring(0,length)+'...';
    else return string;
  };

  public static getSeason(month: string) {
    if(['12', '1', '2'].includes(month)) {
      return '🏖️';
    } else if(['3', '4', '5'].includes(month)) {
      return '🍂';
    } else if(['6', '7', '8'].includes(month)) {
      return '❄️';
    } else if(['9', '10', '11'].includes(month)) {
      return '🏕️';
    } else {
      return '';
    }
  };
}