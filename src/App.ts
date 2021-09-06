import dotenv from 'dotenv';
import express from 'express';
import glx from 'greenlock-express';
import morgan from 'morgan';


dotenv.config();

import { Util } from './Util';
import { createServer } from 'http';
import { join } from 'path';
import { Config } from './Config';

const server = express();
const http = createServer(server);

server.use('/assets', express.static(join(__dirname, '../assets')));
server.use(morgan('dev'));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.set('view engine', 'ejs');

server.get('/', async (req, res) => {
  res.render(join(__dirname, '/pages/home.ejs'), {
    config: Config,
    weather: await Util.Weather(),
    nowplaying: await Util.NowPlaying(),
    dots: Util.dots,
    getSeason: Util.getSeason,
  });
});

if(process.env.IS_PROD) {
  Util.print(`Production Mode`);
  glx.init({ packageRoot: join(__dirname, '../'), maintainerEmail: 'jurgenjacobsen2005@gmail.com', configDir: './greenlock.d', cluster: false })
  .ready((glx: any) => {
    glx.serveApp(server);
    Util.print(`Ready on port: ${process.env.PORT}`);
  });
} else {
  Util.print(`Development Mode`);
  http.listen(process.env.PORT, () => {
    Util.print(`Ready on port: ${process.env.PORT}`);
  });
}
