import os

# Estructura de carpetas
folders = [
    "my_flask_app/",
    "my_flask_app/app/",
    "my_flask_app/app/static/",
    "my_flask_app/app/static/css/",
    "my_flask_app/app/static/js/",
    "my_flask_app/app/templates/",
    "my_flask_app/uploads/"
]

# Archivos a crear con contenido inicial
files = {
    "my_flask_app/requirements.txt": "Flask\ngunicorn\n",
    "my_flask_app/Procfile": "web: gunicorn run:app\n",
    "my_flask_app/run.py": """\
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
""",
    "my_flask_app/app/__init__.py": """\
from flask import Flask

def create_app():
    app = Flask(__name__)
    from .routes import main
    app.register_blueprint(main)
    return app
""",
    "my_flask_app/app/routes.py": """\
from flask import Blueprint, request, jsonify, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/tema', methods=['GET'])
def get_tema():
    temas = ["Tema 1", "Tema 2", "Tema 3"]
    return jsonify(temas)

@main.route('/api/tipo', methods=['GET'])
def get_tipo():
    tipos = ["Tipo 1", "Tipo 2", "Tipo 3"]
    return jsonify(tipos)

@main.route('/api/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    tema = request.form['tema']
    tipo = request.form['tipo']
    # Guardar el archivo en una ubicación específica
    file.save(f"./uploads/{{file.filename}}")
    return jsonify({"message": "Archivo subido correctamente", "tema": tema, "tipo": tipo})
""",
    "my_flask_app/app/templates/index.html": """\
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subir Video</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body>
    <h1>Subir Video</h1>
    <form id="uploadForm" enctype="multipart/form-data">
        <label for="tema">Elegir Tema:</label>
        <select id="tema" name="tema">
            <option value="">Seleccionar Tema</option>
        </select>
        <br>
        <label for="tipo">Elegir Tipo de Contenido:</label>
        <select id="tipo" name="tipo">
            <option value="">Seleccionar Tipo</option>
        </select>
        <br>
        <label for="file">Seleccionar Archivo:</label>
        <input type="file" id="file" name="file">
        <br>
        <label>Seleccionar Tipo de Archivo:</label>
        <input type="radio" id="mp4" name="file_type" value="MP4">
        <label for="mp4">MP4</label>
        <input type="radio" id="avi" name="file_type" value="AVI">
        <label for="avi">AVI</label>
        <input type="radio" id="mkv" name="file_type" value="MKV">
        <label for="mkv">MKV</label>
        <br>
        <button type="submit">Subir Video</button>
    </form>
    <script src="{{ url_for('static', filename='js/script.js') }}"></script>
</body>
</html>
""",
    "my_flask_app/app/static/css/style.css": """\
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    color: #333;
    text-align: center;
    margin-top: 50px;
}
h1 {
    color: #ff0066;
}
form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: inline-block;
}
label {
    display: block;
    margin: 10px 0 5px;
}
select, input[type="file"], input[type="radio"], button {
    margin: 10px 0;
}
""",
    "my_flask_app/app/static/js/script.js": """\
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/tema')
        .then(response => response.json())
        .then(data => {
            const temaSelect = document.getElementById('tema');
            data.forEach(tema => {
                const option = document.createElement('option');
                option.value = tema;
                option.textContent = tema;
                temaSelect.appendChild(option);
            });
        });

    fetch('/api/tipo')
        .then(response => response.json())
        .then(data => {
            const tipoSelect = document.getElementById('tipo');
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo;
                option.textContent = tipo;
                tipoSelect.appendChild(option);
            });
        });

    document.getElementById('uploadForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => console.error('Error:', error));
    });
});
"""
}

# Crear carpetas
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Crear archivos con contenido
for filepath, content in files.items():
    with open(filepath, 'w') as file:
        file.write(content)

print("Estructura de proyecto creada exitosamente.")
