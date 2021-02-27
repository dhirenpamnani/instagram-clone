import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from '../firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

 
    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () =>{

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                    );
                setProgress(progress);
            },
            (error) => {
                // catch any error while uploading
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function 
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside database
        
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
                
            }
        )
    }

    return (
        <div className="imageupload">
        {/* caption input , file upload ,  and post button*/}
            <h1 className="image_title">Upload Images</h1>

            <progress className="imageupload_progress"  value={progress} max="100"></progress>
            <input type="text" className="imageupload_text" placeholder="Enter a caption..." 
            onChange={event => setCaption(event.target.value)} value={caption}/> 
            <input type="file" className="imageupload_file" onChange={handleChange} value={image}/> 

            <Button onClick={handleUpload}>
                Upload
            </Button> 
        </div>
    )
}

export default ImageUpload
