import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";

function UploadVideo({ db }) {
  const storage = getStorage();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);

    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Update progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        // Get video URL and store in Realtime Database
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const videoId = file.name.split(".")[0]; // Use filename as ID
        set(db, `videos/${videoId}`, { url: downloadURL });
        setUploading(false);
        alert("Upload successful!");
      }
    );
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>{uploading ? `Uploading ${progress}%` : "Upload"}</button>
    </div>
  );
}

export default UploadVideo;