import React, { useState, useEffect,Component } from 'react';
import { Setup } from './setup';
const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}
const myMap= new Map([
    ["ano0u964x8jvy11b5z8stovb3", "Gouerine"],
    ["21zgtegla4e7dq4wymm27xsdq", "Shampoo"],
    ["31mynqwbghuqm3mws43dpwjzwipq", "Gabougi"],
    ["gaboulacasse", "Gab"],
    ["22ma72dcr32kotfqx6k5qrc2i", "Laurie"],
    ["22n5rrw3kn5j2o7yqzq72hhba", "Paquet"],
    ["kaobilin", "Kayo"],
    ["donodube", "Dono"],
    ["francis-william", "Frank"],
    ["au_soc_2000", "Audrey"],
    ["3401163", "D-A"],
    ["21b6mpkedbmm27zr73amxoezy", "Sam"],
    ["xtyaemma6bns3zzrzs95si3g3", "Bobo"],
    ["thomgiroux", "Tom"],
    ["vbw6drqkg2zd9kp3u54uq2awl", "Raphicock"],
    ["5tr36khdf2mw1stbr46qar1mn", "Marylise"],
    ["minimarcoux", "Marcoux"]
  ])
class ss extends Component{
    state = {
      showMessage: false
    }
    onButtonClickHandler = () => {
     this.setState({showMessage: true});
    };
  
    render(){ 
      return(<div className="ss">
       {this.state.showMessage && <p>Hi</p>}
        <button onClick={this.onButtonClickHandler}>Enter</button>
      </div>);
  
    }
  }

function WebPlayback(props) {
    const [text, setText] = useState("");
    const [array, setArray] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showText, setShowText] = useState(false);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    function toggleText() {
        console.log("__________________________")
        setShowText(!showText); // Toggle the display of the text
        
    }
    async function startGame() {
        //GetData.getPlaylist();
        let array1=await Setup.GetAllSongsFromUsers();
        setArray(array1);
        setText(myMap.get(array1[currentIndex].addedByKey));
    };
    function goToPrevious() {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex-1);
        }
      }
      function goToNext() {
        if (currentIndex < array.length - 1) {
          setCurrentIndex(prevState=>{
            setText(myMap.get(array[prevState+1].addedByKey));
            return prevState+1;
          });
          setShowText(false);
          //setText(myMap.get(array[tempIndex].addedByKey));
        }
      }
    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();
        };
    }, []);

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => {  goToNext();player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container">
                
                <button className="btn-spotify" onClick={() => { startGame()}} >
                    Start
                </button>
                <button className="btn-spotify" onClick={() =>toggleText()} >
                    Show
                </button>
                <h1>{!!showText&&text}</h1>
                </div>
            </>
        );
    }
}

export default WebPlayback
