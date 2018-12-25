const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app');
const path = require('path');
// const sql = require('mssql');
const bodyParser = require('body-parser');
// const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 4000;

// const config = {
//   user: 'bookstore06',
//   password: 'Admin@123', //Dummy one ;-)
//   server: 'bookstore06.database.windows.net', // You can use 'localhost'
//   database: 'bookstore',
//
//   options: {
//     encrypt: true, // Use this if you're on Windows Azure
//   },
// };

// sql.connect(config).catch(err => debug(err));

const nav = [{ title: 'Author', link: '/author' }, { title: 'Books', link: '/books' }];
const bookRouter = require('./src/router/bookRouter')(nav);
const adminRouter = require('./src/router/adminRoutes')(nav);
const authRouter = require('./src/router/authRoutes')(nav);


app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'bookstore' }));

require('./src/config/passport.js')(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  debug('my middleware');
  next();
});
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Bookstore',
    nav: [{ title: 'Author', link: '/author' }, { title: 'Books', link: '/books' }],
  });
});

app.listen(port, () => {
  debug(`listening to prot ${chalk.green(port)}`);
});
