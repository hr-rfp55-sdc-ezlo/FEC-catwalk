const express = require('express');
const path = require('path');

const PORT = 3001;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/dist/images', express.static(path.join(__dirname, '..', 'dist', 'images')));

app.listen(PORT, () => {
  console.log(`Make me suffer at port ${PORT}!`);
});