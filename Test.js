const fs = require('fs');

// Read the input data from the JSON file
const inputData = JSON.parse(fs.readFileSync('heartrate.json', 'utf8'));

// Prepare the array to store the calculated results
const outputData = [];

// Iterate through each measurement in the input data
inputData.forEach((measurement) => {
  const bpm = measurement.beatsPerMinute;
  const timestamp = measurement.timestamps.startTime.split('T')[0]; // Extract the date part from the timestamp
console.log(timestamp);
  // Check if the date is already present in the outputData
  const existingDate = outputData.find((item) => item.date === timestamp);
  console.log(existingDate);
  console.log(outputData);


  if (existingDate) {
    existingDate.min = Math.min(existingDate.min, bpm);
    existingDate.max = Math.max(existingDate.max, bpm);
    existingDate.median.push(bpm);
    existingDate.latestDataTimestamp = measurement.timestamps.startTime;
  } else {
    outputData.push({
      date: timestamp,
      min: bpm,
      max: bpm,
      median: [bpm],
      latestDataTimestamp: measurement.timestamps.startTime
    });
  }
});

// Calculate the median for each date
outputData.forEach((item) => {
  item.median = calculateMedian(item.median);
});

// Write the output data to the JSON file
fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));

// Function to calculate the median of an array
function calculateMedian(arr) {
  const sortedArr = arr.sort((a, b) => a - b);
  const len = sortedArr.length;
  const mid = Math.floor(len / 2);

  if (len % 2 === 0) {
    return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
  } else {
    return sortedArr[mid];
  }
}
