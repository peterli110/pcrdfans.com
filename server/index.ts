// import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as useragent from 'express-useragent';
// import * as helmet from 'helmet';
import * as next from 'next';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const start = async () => {
  try {
    await app.prepare();
    const server = express();

    if (!dev) {
      // server.use(compression()); // gzip
      server.enable('trust proxy');
    }
    server.use(cookieParser());
    // server.use(helmet());
    server.use(useragent.express());

    server.all('*', async (_, res, n) => {
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      // (req as any).ipaddr =
      //  req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
      n();
    });

    const optionsPlain = {
      root: __dirname + '/../../static/',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };
    const optionsHtml = {
      root: __dirname + '/../../static/',
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    };
    const optionsXml = {
      root: __dirname + '/../../static/',
      headers: {
        'Content-Type': 'application/xml;charset=UTF-8',
      },
    };
    const optionsPng = {
      root: __dirname + '/../../static/',
      headers: {
        'Content-Type': 'image/png',
      },
    };
    server.get('/robots.txt', (_, res) =>
      res.status(200).sendFile('robots.txt', optionsPlain)
    );
    server.get('/ads.txt', (_, res) =>
      res.status(200).sendFile('ads.txt', optionsPlain)
    );
    server.get('/sitemap.html', (_, res) =>
      res.status(200).sendFile('sitemap.html', optionsHtml)
    );
    server.get('/sitemap.xml', (_, res) =>
      res.status(200).sendFile('sitemap.xml', optionsXml)
    );
    server.get('/logo.png', (_, res) =>
      res.status(200).sendFile('logo.png', optionsPng)
    );

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err: any) => {
      if (err) throw err;
      console.log('> Ready on http://localhost ' + port);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

start();
