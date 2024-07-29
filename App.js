import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const chosenFile = e.target.files[0];
        setFile(chosenFile);
        setFileName(chosenFile ? chosenFile.name : '');
    };

    const handleFileUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setError('');
            const uploadResponse = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const filePath = uploadResponse.data.file_path;

            const summaryResponse = await axios.post('http://localhost:8000/summarize', { file_path: filePath });
            setSummary(summaryResponse.data.summary);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('There was an error uploading the file.');
        }
    };

    return (
        <div className="App">
            <h1>Document Summarizer</h1>
            <input type="file" id="file" onChange={handleFileChange} />
            <label htmlFor="file">Choose a file</label>
            {fileName && <p className="file-name">{fileName}</p>}
            <button onClick={handleFileUpload}>Upload and Summarize</button>
            {error && <p className="error">{error}</p>}
            {summary && (
                <div className="summary">
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

export default App;
