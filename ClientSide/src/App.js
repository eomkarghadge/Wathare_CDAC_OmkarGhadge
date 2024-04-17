import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Upload from './Upload';
import SummaryTable from './SummaryTable';
import WeatherWidget from './WeatherWidget';
function App() {
  const [rawData, setRawData] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [frequency, setFrequency] = useState('');

  const parseData = (data) => {
    return data.map((item) => ({
      timestamp: item.ts,
      machine_status: item.machine_status,
    }));
  };

  const handleInputChange = (e) => {
    const formattedDateTime = convertToLocalDateTime(e.target.value);
    setStartTime(formattedDateTime);
  };


  const handleFilter = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/filter?startTime=${startTime}&frequency=${frequency}`);
      console.log(response.data);
      const parsedData = parseData(response.data);
      setRawData(parsedData);
    } catch (error) {
      console.error('Error filtering data:', error);
    }
  };


  const getColor = (status) => {
    switch (status) {
      case 0:
        return 'yellow';
      case 1:
        return 'green';
      default:
        return 'red';
    }
  };

  const renderCandles = () => {
    const candles = [];
    let prevTimestamp = null;

    rawData.forEach((item, index) => {
      const currentTimestamp = new Date(item.timestamp).getTime();
      if (prevTimestamp && currentTimestamp - prevTimestamp > 1000) {
        const missingSeconds = Math.floor((currentTimestamp - prevTimestamp) / 1000);
        for (let i = 1; i < missingSeconds; i++) {
          candles.push(
            <div
              key={`missing-${index}-${i}`}
              className="candle"
              style={{ backgroundColor: 'red', height: '30px', width: '1px', flexShrink: 0 }}
              title={'Missing Timestamp'}
            />
          );
        }
      }
      candles.push(
        <div
          key={index}
          className="candle"
          style={{ backgroundColor: getColor(item.machine_status), height: '30px', width: '1px', flexShrink: 0 }}
          title={`Timestamp: ${item.timestamp}`}
        />
      );
      prevTimestamp = currentTimestamp;
    });

    return candles;
  };

  const convertToLocalDateTime = (datetimeLocal) => {
    const [datePart, timePart] = datetimeLocal.split('T');
    const formattedDateTime = datePart + ' ' + timePart + ':00';
    return formattedDateTime;
  };

  return (
    <div className="container mt-5">
        <WeatherWidget/>
      <h1>Data Visualization Dashboard</h1>
      <Upload />
      <div>
        <input type="datetime-local" className="form-control" value={startTime} onChange={handleInputChange} />
        <select className="form-select mt-2" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={handleFilter}>Filter Data</button>
      </div>
      

      <h1>Data Visualization</h1>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <h2>Plot</h2>
        <div style={{ display: 'flex', minWidth: `${rawData.length}px` }}>
          {renderCandles()}
        </div>
      </div>
      <br/>
      <br/>
     <div>
      <SummaryTable rawData={rawData}/>
      </div>
    </div>
  );
}

export default App;
