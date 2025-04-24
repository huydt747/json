const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const readDataFromFile = () => {
  const rawData = fs.readFileSync('data.json');
  return JSON.parse(rawData);
};

const writeDataToFile = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

app.get('/api/items', (req, res) => {
  const data = readDataFromFile();
  res.json(data);
});

app.get('/api/items/:id', (req, res) => {
  const data = readDataFromFile();
  const item = data.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Không tìm thấy item });
  }
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const data = readDataFromFile();
  const newItem = {
    id: data.length ? data[data.length - 1].id + 1 : 1,
    ...req.body
  };
  data.push(newItem);
  writeDataToFile(data);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const data = readDataFromFile();
  const index = data.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy item' });
  }
  data[index] = { id: parseInt(req.params.id), ...req.body };
  writeDataToFile(data);
  res.json(data[index]);
});

app.delete('/api/items/:id', (req, res) => {
  let data = readDataFromFile();
  const index = data.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy item' });
  }
  data = data.filter((i) => i.id !== parseInt(req.params.id));
  writeDataToFile(data);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server đang chạy ở http://localhost:${PORT}         endpoint: http://localhost:${PORT}/api/items/ `);
});
