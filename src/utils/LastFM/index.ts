import axios from "axios";

export default class LastFM {
    public getUserInfoLastUpdate: Date | undefined;
    public cachedUserInfo: any | undefined;
    public apiURL: string;
    constructor() {
        this.apiURL = 'http://ws.audioscrobbler.com/2.0/';
    }

     async call(method: string, param: string) {
        let keys = (await axios.get("http://localhost:3000/keys")).data;
        let url = `${this.apiURL}?method=${method}&${param}&api_key=${keys.LAST_FM_API_KEY}&format=json`;
        let { data } = 

        await axios({
            url: url,
            method: 'GET',
        });
        
        return data;
    }

    async getInfo(user = 'jurgenjacobsen') {
        console.log(this.getUserInfoLastUpdate)
        if(
            this.getUserInfoLastUpdate && 
            (new Date().getTime() - this.getUserInfoLastUpdate.getTime()) < 10 * 60 * 1000
          ) {
            console.log(this.cachedUserInfo)
            return this.cachedUserInfo;
          }

        let data = await this.call("user.getInfo", `user=${user}`);
        
        this.cachedUserInfo = data.user;
        this.getUserInfoLastUpdate = new Date();
        
        return data.user;
    }
}