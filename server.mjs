
import path from '/node_modules/path';
import { fileURLToPath } from '/node_modules/url';
import express from '/node_modules/express';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ...
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'nodes_modules')));
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname+'/src/public/interface.html');
  
  res.sendFile(indexPath);
});

// ...

app.listen(port, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
