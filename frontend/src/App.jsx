import './App.css'
import { useRef } from 'react'
import VideoPlayer from './VideoPlayer.jsx';

function App() {
  const playerRef = useRef(null);
  const videoLink = "http://localhost:8000/uploads/courses/6856ba5e-cc4b-4388-8f12-084ded5fa91c/index.m3u8"

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example: 
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
   <>
    <div>
      <h1>Video player</h1>
    </div>

    <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
    />
   </>
  )
}

export default App
