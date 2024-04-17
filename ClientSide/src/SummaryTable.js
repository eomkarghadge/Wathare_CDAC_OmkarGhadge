import React from 'react';

const SummaryTable = ({ rawData }) => {
  const generateSummary = () => {
    // Initialize summary variables
    let onesCount = 0;
    let zerosCount = 0;
    let continuousOnes = 0;
    let maxContinuousOnes = 0;
    let continuousZeros = 0;
    let maxContinuousZeros = 0;

    // Iterate through rawData to calculate summary metrics
    rawData.forEach((item) => {
      // Increment onesCount or zerosCount based on machine_status
      if (item.machine_status === 1) {
        onesCount++;
        continuousOnes++;
        // Update maxContinuousOnes if needed
        if (continuousOnes > maxContinuousOnes) {
          maxContinuousOnes = continuousOnes;
        }
        // Reset continuousZeros count
        continuousZeros = 0;
      } else {
        zerosCount++;
        continuousZeros++;
        // Update maxContinuousZeros if needed
        if (continuousZeros > maxContinuousZeros) {
          maxContinuousZeros = continuousZeros;
        }
        // Reset continuousOnes count
        continuousOnes = 0;
      }
    });

    // Construct the summary object
    const summary = {
      onesCount,
      zerosCount,
      maxContinuousOnes,
      maxContinuousZeros,
    };

    return summary;
  };

  const summary = generateSummary();

  return (
    <div>
      <h2>Summary Table</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Number of 1s</td>
            <td>{summary.onesCount}</td>
          </tr>
          <tr>
            <td>Number of 0s</td>
            <td>{summary.zerosCount}</td>
          </tr>
          <tr>
            <td>Max Continuous 1s</td>
            <td>{summary.maxContinuousOnes}</td>
          </tr>
          <tr>
            <td>Max Continuous 0s</td>
            <td>{summary.maxContinuousZeros}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
