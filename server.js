require('dotenv').config();

const express = require('express');
const path = require('path');
const webRoutes = require('./src/routes/web');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(webRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Cupcake Gourmet disponível em http://localhost:${port}`);
  });
}

module.exports = app;