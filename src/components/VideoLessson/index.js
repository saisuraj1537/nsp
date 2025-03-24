function VideoLesson({ db }) {
    const { id } = useParams();
    const [videoUrl, setVideoUrl] = useState("");
  
    useEffect(() => {
      const videoRef = ref(db, `videos/${id}`);
      onValue(videoRef, (snapshot) => {
        if (snapshot.exists()) {
          setVideoUrl(snapshot.val().url);
        }
      });
    }, [id, db]);
  
    return (
      <div>
        <h2>Video Lesson {id}</h2>
        <iframe width="560" height="315" src={videoUrl} title="Video Lesson" allowFullScreen></iframe>
        <a href={`/assessment/${id}`}>Take Assessment</a>
      </div>
    );
  }

export default VideoLesson;  