
export default class LastFM {
    public getUserInfoLastUpdate: Date | undefined;
    public userTopSongs: Map<string, any> = new Map<string, any>();
    public apiURL: string;
    constructor() {
        this.apiURL = 'http://ws.audioscrobbler.com/2.0/';
    }

     async call(method: string, param: string, extra?:string) {
        let url = `
        http://localhost:3000/lastfm?method=${method}&param=${param}
        ${extra ? `&${extra}` : ''}`;
        let data = await (await fetch(url,  {mode:'cors'})).json();
        return data;
    }

    async getUserInfo() {
        let data = await this.call('user.getInfo', 'user=jurgenjacobsen');
        return data.user;
    }

    async getUserTopSongs() {
        let data = await this.call('user.getTopTracks', 'user=jurgenjacobsen', 'period=7day');
        data.toptracks.track.forEach((track: any) => {
            this.userTopSongs.set(track.mbid, track);
        });

        return {
            array: data.toptracks.track,
            map: this.userTopSongs,
        };
    }
    async getUserTopSongsCovers() {
        this.userTopSongs.forEach(async (track: any) => {
            if(!track.mbid) return;
            
            let data = await this.call('track.getInfo', `artist=${track.artist.name}_track=${track.name}`);

            this.userTopSongs.set(track.mbid, {
                ...track,
                cover: data.track.album.image[3]['#text'],
            });

        });
    }

    getUserCache() {
        return this.userTopSongs;
    }
}