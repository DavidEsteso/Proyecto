import os
from pytube import YouTube
from gtts import gTTS
def generate_video(narration, youtube_link, bacground_music):
    # Aquí iría la lógica para generar el video
    # Por ahora, solo devolvemos un mensaje simulado
    download_video_from_youtube(youtube_link)
    text_to_speech(narration)
    download_audio_from_youtube(bacground_music)
    


def download_video_from_youtube(url):
    try:
        yt = YouTube(url)
        video = yt.streams.get_highest_resolution()
        video.download('video_content/')
    except Exception as e:
        print(f'Error downloading video from {url}: {str(e)}')

def download_audio_from_youtube(url):
    try:
        yt = YouTube(url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        audio_file = audio_stream.download(output_path='audio_content', filename='audio')
        print(f'Audio downloaded successfully: {audio_file}')
        return audio_file
    except Exception as e:
        print(f'Error downloading audio from {url}: {str(e)}')

    
def text_to_speech(text):
    tts = gTTS(text=text, lang='es')  
    tts.save('video_content/narration.mp3')