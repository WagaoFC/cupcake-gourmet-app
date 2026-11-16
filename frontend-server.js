const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');

app.use(express.static(publicDirectory));
app.get('/image.jfif', (req, res) => {
    res.sendFile(path.join(__dirname, 'image.jfif'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Cupcake Gourmet disponível em http://localhost:${port}`);
    });
}

module.exports = app;