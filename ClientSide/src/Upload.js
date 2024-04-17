
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Upload() {
  const [rawData, setRawData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const jsonData = JSON.parse(content);
        setRawData(jsonData);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };
  
  const importData = async () => {
    const batchSize = 100;
    const numBatches = Math.ceil(rawData.length / batchSize);

    async function sendBatch(startIndex) {
      const endIndex = Math.min(startIndex + batchSize, rawData.length);
      const batch = rawData.slice(startIndex, endIndex);

      try {
        const response = await axios.post('http://localhost:9999/import', batch);
        console.log(`Batch ${startIndex}-${endIndex - 1} imported successfully`);

        if (endIndex < rawData.length) {
          setTimeout(() => sendBatch(endIndex), 100);
        } else {
          console.log('All batches imported successfully');
        }
      } catch (error) {
        console.error(`Error importing batch ${startIndex}-${endIndex - 1}:`, error.message);
      }
    }
    sendBatch(0);
  };

  return (
    <div className="container mt-5">
      <div className="input-group mb-3">
        <input type="file" className="form-control" accept=".json" onChange={handleFileChange} />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={importData}>Import Raw Data</button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
