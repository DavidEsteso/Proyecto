import fetch from 'node-fetch';

function validateYoutubeLink(youtubeLink) {
    // Check if the youtubeLink is a valid YouTube video URL
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    if (!regex.test(youtubeLink)) {
        return Promise.resolve(false);
    }

    // Extract the video ID from the YouTube link
    const videoId = extractVideoId(youtubeLink);

    if (!videoId) {
        return Promise.resolve(false);
    }

    // Make a request to the YouTube API to check if the video exists
    return fetch(`https://www.googleapis.com/youtube/v3/videos?part=id&id=${videoId}&key=AIzaSyDDA5bfvWAdBPXn-K_kD9BeU1M-ju3VSeY`)
        .then(response => response.json())
        .then(data => {
            return data.items.length > 0;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function extractVideoId(youtubeLink) {
    // Extract the video ID from the YouTube link
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=)?([^#\&\?]*).*/;
    const match = youtubeLink.match(regex);
    if (match && match[5]) {
        return match[5];
    } else {
        return null;
    }
}

function getVideoInfo(youtubeLink) {
    const videoId = extractVideoId(youtubeLink);

    if (!videoId) {
        return Promise.resolve(null);
    }

    return fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDDA5bfvWAdBPXn-K_kD9BeU1M-ju3VSeY`)
        .then(response => response.json())
        .then(data => {
            if (data.items.length === 0) {
                return null;
            }
            const videoTitle = data.items[0].snippet.title;
            const videoThumbnail = data.items[0].snippet.thumbnails.default.url;
            return { title: videoTitle, thumbnail: videoThumbnail };
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

// Define an async function to call getVideoInfo and await the result
async function checkYoutubeLink() {
    const videoInfo = await getVideoInfo("https://www.youtube.com/watch?v=qWUobN0xtcE&ab_channel=d-to8random");
    if (videoInfo) {
        console.log('Video Title:', videoInfo.title);
        console.log('Video Thumbnail:', videoInfo.thumbnail);
    } else {
        console.log('Invalid YouTube link or video does not exist.');
    }
}

// Call the async function
checkYoutubeLink();
