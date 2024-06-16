let videoLinkValid = false;
let musicLinkValid = true;
let validText = false;

document.addEventListener('DOMContentLoaded', function () {
    toggleVideoType();
    document.getElementById('generateVideoForm').addEventListener('submit', function (e) {
        e.preventDefault();
        generateVideo();
    });

    setupListeners();
});

function setupListeners() {
    document.getElementById('videoLink').addEventListener('input', videoLinkListener);
    document.getElementById('musicLink').addEventListener('input', musicLinkListener);
}

function videoLinkListener() {
    const videoLinkInput = document.getElementById('videoLink');
    const videoLink = videoLinkInput.value;
    if (videoLink === '') {
        videoLinkInput.style.borderColor = '';
        videoLinkValid = false;
        updateLinkValidation('video', false, '', '');
    } else {
        getVideoInfo(videoLink)
            .then(info => {
                if (info) {
                    updateLinkValidation('video', true, info.title, info.thumbnail);
                } else {
                    updateLinkValidation('video', false, '', '');
                }
                validateForm();
            })
            .catch(error => {
                console.error('Error:', error);
                document.body.style.backgroundColor = getRandomColor();
                updateLinkValidation('video', false, '', '');
                validateForm();
            });
    }
}

function musicLinkListener() {
    const musicLinkInput = document.getElementById('musicLink');
    const musicLink = musicLinkInput.value;
    if (musicLink === '') {
        musicLinkInput.style.borderColor = '';
        musicLinkValid = false;
        updateLinkValidation('music', false, '', '');
    } else {
        getVideoInfo(musicLink)
            .then(info => {
                if (info) {
                    updateLinkValidation('music', true, info.title, info.thumbnail);
                } else {
                    updateLinkValidation('music', false, '', '');
                }
                validateForm();
            })
            .catch(error => {
                console.error('Error:', error);
                document.body.style.backgroundColor = getRandomColor();
                updateLinkValidation('music', false, '', '');
                validateForm();
            });
    }
}

function updateLinkValidation(type, isValid, title, thumbnail) {
    const input = document.getElementById(type + 'Link');
    const thumbnailElement = document.getElementById(type + 'Thumbnail');
    const titleElement = document.getElementById(type + 'Title');

    
    if (isValid) {
        thumbnailElement.src = thumbnail;
        thumbnailElement.style.display = 'block';
        titleElement.textContent = title;
        titleElement.style.display = 'block';
        if (type === 'video') {
            videoLinkValid = true;
        } else if (type === 'music') {
            musicLinkValid = true;
        }
    } else {
        thumbnailElement.style.display = 'none';
        thumbnailElement.src = '';
        titleElement.style.display = 'none';
        titleElement.textContent = '';
        if (type === 'video') {
            videoLinkValid = false;
        } else if (type === 'music') {
            musicLinkValid = false;
        }
    }
}
function validateText() {   
    const narrationText = document.getElementById('narrationText').value.trim();
    const facts = document.querySelectorAll('input[name="fact[]"]');
    validText = narrationText !== '' || Array.from(facts).some(fact => fact.value.trim() !== '');
    validateForm();
}


function validateForm() {
    const generateButton = document.getElementById('generateVideoButton');
    if (validText && videoLinkValid && musicLinkValid) {
        generateButton.disabled = false;
        generateButton.style.opacity = 1;
        generateButton.style.cursor = 'pointer';    
    } else {
        generateButton.disabled = true;
        generateButton.style.opacity = 0.5;
        generateButton.style.cursor = 'not-allowed';
    }
}

function toggleVideoType() {
    const videoType = document.getElementById('videoType').value;
    if (videoType === 'facts') {
        factsContainer.style.display = 'block';
        narrationContainer.style.display = 'none';
    } else {
        factsContainer.style.display = 'none';
        narrationContainer.style.display = 'block';
    }
    validateForm();
}

function addFact() {
    const container = document.getElementById('factsContainer');
    const fact = document.createElement('div');
    fact.className = 'fact';
    fact.innerHTML = `
        <textarea name="fact[]" rows="4" cols="50" placeholder="Enter fact"></textarea>
        <button type="button" onclick="removeFact(this)">Remove</button>
    `;
    container.insertBefore(fact, document.getElementById('addFactButton'));
}

function removeFact(button) {
    const fact = button.parentNode;
    fact.parentNode.removeChild(fact);
    validateForm();
}

function toggleMusicSection() {
    const musicLinkLabel = document.getElementById('musicLinkLabel');
    const musicLinkInput = document.getElementById('musicLink');
    const musicDetails = document.getElementById('musicDetails');
    const toggleMusicButton = document.getElementById('toggleMusicButton');

    const isAddingMusic = musicLinkInput.style.display === 'none';
    if (isAddingMusic) {
        musicLinkInput.value = '';
        musicLinkInput.style.borderColor = '';
        musicLinkValid = false;
    }
    else {
        musicLinkValid = true;
    }
    musicLinkInput.style.display = isAddingMusic ? 'block' : 'none';
    musicLinkLabel.style.display = isAddingMusic ? 'block' : 'none';
    musicDetails.style.display = isAddingMusic ? 'block' : 'none';
    toggleMusicButton.textContent = isAddingMusic ? 'Remove Music from Video' : 'Add Music to Video';
    validateForm();
}

function generateVideo() {
    const narrationText = document.getElementById('narrationText').value;
    if (document.getElementById('videoType').value === 'facts') {
        narrationText = generateFactsVideo();
    } 
    const videoLink = document.getElementById('videoLink').value;
    const musicLink = document.getElementById('musicLink').value;
    alert(`Video Link: ${videoLink}\nMusic Link: ${musicLink}\nNarration Text: ${narrationText}`);    
}

function generateFactsVideo() {
    const facts = document.querySelectorAll('input[name="fact[]"]');
    return Array.from(facts).map(fact => fact.value.trim()).join('\n');
}
function extractVideoId(youtubeLink) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=)?([^#\&\?]*).*/;
    const match = youtubeLink.match(regex);
    return match && match[5] ? match[5] : null;
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
        });
}
