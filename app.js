const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app');
const path = require('path');
const sql = require('mssql')

const app = express();
const port = process.env.PORT || 4000;

const config = {
    user: 'bookstore06',
    password: 'Admin@123',
    server: 'bookstore06.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'bookstore',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

sql.connect(config).catch(err=>debug(err));

const nav = [{title: 'Author', link: '/author'}, {title: 'Books', link: '/books'},];
const bookRouter = require('./src/router/bookRouter')(nav);



app.use(morgan('tiny'));
app.use((req,res,next) => {
  debug('my middleware');
  next();
})
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/books', bookRouter)
app.get('/', (req, res) => {
  res.render('index',{
    title: 'Bookstore',
      nav: [{title: 'Author', link: '/author'}, {title: 'Books', link: '/books'}]
  });
});

app.listen(port, () => {
  debug(`listening to prot ${chalk.green(port)}`);
});
