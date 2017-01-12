var fs = require('fs');
const request = require('requestretry');

var witURL = 'https://dev-witness.visualstudio.com';
var path = '/DefaultCollection/_apis/wit/attachments?api-version=1.0&fileName=something.xlsx';
var token = '';

uploadExcel('./something.xlsx');

function uploadExcel(filename) {
  fs.readFile(filename, 'binary', (err, data) => {
    if (err) {
      console.log("FATAL An error occurred trying to read in the file: " + err);
    }

    if (data) {
      uploadToWit(data);
    }
    else {
      console.log("No data to post");
    }
  });
}

function uploadToWit(stream) {


    const options = {
      url: witURL + path,
      maxAttempts: 3,
      method: 'POST',
      retryDelay: 250,
      body: stream,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
      headers: {
        'Content-Type': 'application/octet-stream',
      //  'Content-Length': Buffer.byteLength(stream),
      'Authorization': token
      }
    };

    const componentDataRequest = request(options, (error, jsonResponse, body) => {
      if (error) {
        console.log('failed request');
        console.log(error);
      } else {
        console.log('success request');
        console.log(jsonResponse.body);
      }
    });

    componentDataRequest.on('error', (error) => {
      console.log(error);
    });

}
