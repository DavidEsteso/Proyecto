import os
from pytube import YouTube
from gtts import gTTS

def generate_video(narration, youtube_link):
    try:
        download_video_from_youtube(youtube_link)
        text_to_speech(narration)
        print("Video and narration generation completed successfully.")
    except Exception as e:
        print(f"Error generating video: {str(e)}")

def generate_video_test():
    narration_text = "viva espaá"
    youtube_link = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Example YouTube link

    generate_video(narration_text, youtube_link)

def download_video_from_youtube(url):
    try:
        yt = YouTube(url)
        video = yt.streams.get_highest_resolution()
        video.download('video_content/')
        print(f"Video downloaded successfully: {video.title}")
    except Exception as e:
        print(f'Error downloading video from {url}: {str(e)}')

def text_to_speech(text):
    tts = gTTS(text=text, lang='es')  
    tts.save('video_content/narration.mp3')
    print("Narration generated successfully.")

if __name__ == "__main__":
    generate_video_test()