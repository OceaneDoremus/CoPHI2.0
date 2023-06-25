
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ...
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname+'/interface.html');
  
  res.sendFile(indexPath);
});

// ...

app.listen(port, () => {
  console.log('Serveur en cours d\'exécution sur le port 33400');
});
