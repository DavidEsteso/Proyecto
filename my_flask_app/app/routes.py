from flask import Blueprint, request, jsonify, render_template
from .logic import generate_video

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/generate', methods=['POST'])
def api_generate_video():
    data = request.get_json()
    narration = data.get('narration')
    youtube_link = data.get('youtubeLink')
    result = generate_video(narration, youtube_link)
    return jsonify(result)
