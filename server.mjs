
// import path from '/node_modules/path/';
// import { fileURLToPath } from '/node_modules/url';  
// import express from '/node_modules/express';
import mime from 'mime';
import path from 'path';  
import express from 'express';
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ...
app.use('/src/css', (req, res, next) => {
  res.setHeader('Content-Type', mime.getType('.css'));
  next();
}, express.static(path.join(__dirname, '/src/css')));
app.use('/src/js', (req, res, next) => {
  res.setHeader('Content-Type', mime.getType('.js'));
  next();
}, express.static(path.join(__dirname, '/src/js')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname+'/interface.html');
  res.sendFile(indexPath);
});


app.listen(port, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
