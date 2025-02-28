import { debug } from 'request';

var SpotifyWebApi = require('spotify-web-api-node');
//get data here= https://developer.spotify.com/dashboard
//clientId: '2011e059394948b1b8fb55cf17191d57',
//clientSecret: '26073e7963ad4e7f89fab8ad3b2eb065',
///redirectUri: 'http://localhost:3000/'
var spotifyApi = new SpotifyWebApi();
spotifyApi.setClientId("2011e059394948b1b8fb55cf17191d57");
spotifyApi.setClientSecret("26073e7963ad4e7f89fab8ad3b2eb065");
const list = new Array(
  "ano0u964x8jvy11b5z8stovb3",
  "21zgtegla4e7dq4wymm27xsdq",
  /*"31mynqwbghuqm3mws43dpwjzwipq",
  "gaboulacasse",
  "22ma72dcr32kotfqx6k5qrc2i",
  "22n5rrw3kn5j2o7yqzq72hhba",
  "kaobilin",
  "donodube",
  "francis-william",
  "au_soc_2000",
  "3401163",
  "xtyaemma6bns3zzrzs95si3g3",
  "thomgiroux",
  "vbw6drqkg2zd9kp3u54uq2awl",
  "5tr36khdf2mw1stbr46qar1mn",
  "minimarcoux",
  "21b6mpkedbmm27zr73amxoezy"*/
)
let currentSongList = []
export class GetData {
  static async getPlaylist() {
    const items2 = await spotifyApi.search(
      "here comes the sun",
      ["track"],
      "CA"
    )
    //get albums
    const items3 = await spotifyApi.makeRequest(
      "GET",
      "users/ano0u964x8jvy11b5z8stovb3/playlists"
    )
    //console.log(items3);
    //get tracks from album ID
    const items4 = await spotifyApi.makeRequest(
      "GET",
      "playlists/" + items3.items[0].id + "/tracks"
    )
    //console.log("WOWOWOOWOW");
    //console.log(items4);
    const items5 = items4.items[0].added_by.id
    //console.log(items5)
    const items6 = items4.items[0].track.external_urls.spotify
    //console.log(items6)
    return null
  }
}
export class Setup {
static async addSongToQueue(songID){
    spotifyApi.addToQueue(songID);
}
  static async save5songsFromPlaylist(playlistId) {
    const items4 = await spotifyApi.getPlaylistTracks(
        playlistId
    )
    //print(items4);
    if(items4.statusCode==200){
        for (let i = 0; i < 5; i++) {
            let random = Math.floor(Math.random() * (items4.body.items.length - 1) + 0)
      
              let song = {
                  addedByKey: items4.body.items[random].added_by.id,
                  songUrl: items4.body.items[random].track.external_urls.spotify
                }
                spotifyApi.addToQueue(song.songUrl)
                currentSongList.push(song)
      
          }
    }
  }

  static async getPlaylistsFromSingleUser(key) {
    const items3 = await spotifyApi.getUserPlaylists(
      key
    )
    console.log(items3);
    //delay(1000);
    //console.log(items3)
    if(items3.statusCode==200){
        for (let i = 0; i < 2; i++) {
        let random = Math.floor(Math.random() * (items3.body.items.length - 1) + 0)
        await this.save5songsFromPlaylist(items3.body.items[random].id)
        }
    }   
  }
  static async GetAllSongsFromUsers() {
    console.log("starting");
    const response = await fetch('/auth/token');
    const json = await response.json();
    spotifyApi.setAccessToken(json.access_token);
    for (let index = 0; index < list.length; index++) {
      await this.getPlaylistsFromSingleUser(list[index])
    }
    console.log("done");
    
    let s = this.shuffle(currentSongList);
    console.log(currentSongList);
    spotifyApi.skipToNext();
    return s
  }
  static shuffle(array) {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ]
    }

    return array
  }
}
