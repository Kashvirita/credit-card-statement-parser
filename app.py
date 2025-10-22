import fitz  # PyMuPDF
import re
import json
import os
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from parser import UniversalCCParser # Import your parser class

# Initialize the Flask application
app = Flask(__name__)

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/parse', methods=['POST'])
def parse_pdf():
    """API endpoint to handle PDF parsing."""
    # Check if a file was uploaded
    if 'statement' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['statement']

    # Check if the file has a name
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    if file and file.filename.lower().endswith('.pdf'):
        try:
            # Read the file from memory
            pdf_bytes = file.read()
            
            # Use fitz to open the PDF from the byte stream
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            text = "".join(page.get_text() for page in doc)
            doc.close()

            # Use your existing parser to extract data
            parser_obj = UniversalCCParser(text)
            extracted_data = parser_obj.extract_all_data()

            # Return the data as JSON
            return jsonify(extracted_data)

        except Exception as e:
            return jsonify({"error": f"An error occurred during parsing: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

# This allows you to run the app directly
if __name__ == '__main__':
    app.run(debug=True)