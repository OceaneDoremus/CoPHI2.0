import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  fs.readFile('/interface.html', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erreur du serveur');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});

