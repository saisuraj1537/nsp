import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { get, ref, set } from "firebase/database";

const YouTubeVideo = ({ db }) => {
  const { category,id } = useParams(); // Get the video key from the URL
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userPhone, setUserPhone] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const storedUserPhone = localStorage.getItem("user_phone");
    if (storedUserPhone) {
      setUserPhone(storedUserPhone);
      checkIfCompleted(storedUserPhone);
    } else {
      console.error("User Phone not found in localStorage");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Fetch video ID from Firebase using the provided id
    const fetchVideoId = async () => {
      try {
        const videoRef = ref(db, `videos/${id}`);
        const snapshot = await get(videoRef);
        if (snapshot.exists()) {
          setVideoId(snapshot.val()); // Set the fetched video ID
        } else {
          console.error("No video found for this ID");
        }
      } catch (error) {
        console.error("Error fetching video ID:", error);
      }
    };

    fetchVideoId();
  }, [id, db]);

  const checkIfCompleted = async (userPhone) => {
    if (!userPhone) return;
    try {
      const completedRef = ref(db, `users/${userPhone}/drone_module/${category}/${id}/video`);
      const snapshot = await get(completedRef);
      if (snapshot.exists() && snapshot.val() === "Completed") {
        setIsCompleted(true);
      } else {
        setIsCompleted(false);
      }
    } catch (error) {
      console.error("Error checking completion status:", error);
    }
  };

  const markAsComplete = async () => {
    if (!userPhone || !id || !category) return;
    try {
      const basePath = `users/${userPhone}/drone_module/${category}/${id}`;
      const completedRef = ref(db, `${basePath}/video`);
      
      // First, check if already marked to avoid double count
      const videoStatus = await get(completedRef);
      if (videoStatus.exists() && videoStatus.val() === "Completed") {
        console.log("Already marked as completed.");
        return;
      }
  
      // Mark this video as completed
      await set(completedRef, "Completed");
      setIsCompleted(true);
      console.log("Video marked as completed for user:", userPhone);
  
      // 🔄 Recalculate module completion count
      const moduleRef = ref(db, `users/${userPhone}/drone_module/${category}`);
      const moduleSnapshot = await get(moduleRef);
  
      let completedCount = 0;
      if (moduleSnapshot.exists()) {
        const moduleData = moduleSnapshot.val();
        
        // Count all "Completed" under this module
        Object.values(moduleData).forEach(item => {
          if (typeof item === "object") {
            Object.values(item).forEach(value => {
              if (value === "Completed") {
                completedCount += 1;
              }
            });
          }
        });
      }
  
      // Fetch current score
      const scoreRef = ref(db, `users/${userPhone}/drone_module/${category}/current_score`);
      await set(scoreRef, completedCount);
  
      console.log("Updated current_score to:", completedCount);
    } catch (error) {
      console.error("Error marking video as completed:", error);
    }
  };
  
  

  useEffect(() => {
    if (videoId) {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        initializePlayer();
      }
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!window.YT || !videoId) return;

    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: videoId, // Use the fetched video ID
      playerVars: {
        modestbranding: 1,
        controls: 1,
        rel: 0,
        disablekb: 1,
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target;
          setTimeout(() => {
            playerRef.current.setPlaybackQuality("hd720"); // Force 720p
          }, 500);
          setPlayerReady(true);
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setTimeout(() => {
              playerRef.current.setPlaybackQuality("hd720");
            }, 500);
          }
        },
      },
    });
  };

  const handleFullScreenChange = () => {
    setIsFullScreen(
      document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
    );
  };

  const playVideo = () => playerReady && playerRef.current.playVideo();
  const pauseVideo = () => playerReady && playerRef.current?.pauseVideo();
  const forwardVideo = () => playerReady && playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10, true);
  const backwardVideo = () => playerReady && playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10, true);

  return (
    <div className="container text-center mt-4" style={{ width: "90vw", height: "90vh", margin: "auto" }}>
      {videoId ? (
        <>
          {/* YouTube Video Wrapper */}
          <div className="position-relative d-inline-block w-100 h-100">
            <div id="youtube-player" className="w-100 h-100"></div>

            {/* Transparent Overlay to Prevent Direct Clicks */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ backgroundColor: "transparent", zIndex: 1 }}
            ></div>

            {/* Overlay Controls */}
            <div
              className="position-absolute d-flex align-items-center justify-content-center w-100"
              style={{
                zIndex: 2,
                bottom: isFullScreen ? "10px" : "0",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <button onClick={backwardVideo} className="btn btn-secondary me-2" disabled={!playerReady}>⏪</button>
              <button onClick={playVideo} className="btn btn-success me-2" disabled={!playerReady}>▶️</button>
              <button onClick={pauseVideo} className="btn btn-danger me-2" disabled={!playerReady}>⏸️</button>
              <button onClick={forwardVideo} className="btn btn-secondary me-2" disabled={!playerReady}>⏩</button>
            </div>
          </div>

          {/* Mark as Complete Button */}
          <div className="mt-3">
            <button 
              onClick={markAsComplete} 
              className="btn btn-primary" 
              disabled={isCompleted}
            >
              {isCompleted ? "✔ Completed" : "Mark as Complete"}
            </button>
          </div>
        </>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default YouTubeVideo;
