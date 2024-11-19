import express from 'express';
import Routes from './routes';
import { PORT } from 'config';

const port = PORT;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Todo List Is Running');
});

app.use('/', Routes);

const server = app.listen(port, () => {
  const { port } = server.address();

  console.log('Example app listening at ', 'http://localhost:8081/', port);
});
