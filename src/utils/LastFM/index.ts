
export default class LastFM {
    public getUserInfoLastUpdate: Date | undefined;
    public cachedUserInfo: any | undefined;
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
        return data.toptracks;
    }
}