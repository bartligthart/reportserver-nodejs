const express = require('express')
const app = express()
const port = 4000;

let axios = require('axios');
let Fs = require('fs');
let Path = require('path');

app.get('/', (req, res) => {
  res.sendFile(Path.join(__dirname + '/index.html'));
})

app.get('/download', async (req, res) => {
  await DownloadReport();
  res.download('./pdfs/Orders.pdf')
})


async function DownloadReport() {
  const data = {
    username: "Demo",
    password: "2020#demo!",
    reportId: "17",
    apiEndpoint: "http://northwind.netcore.io/query/orders.json?Freight>=400",
    pathParameters: [],
    queryParameters: [],
    filename: "Orders.pdf",
    exportType: "pdf"
  }

  const url = 'https://connect.reportserver.eu/generate/file'
  const path = Path.resolve(__dirname, 'pdfs', data.filename)
  const writer = Fs.createWriteStream(path)

  const response = await axios({ url, data, method: 'POST', responseType: 'stream' })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

}

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
