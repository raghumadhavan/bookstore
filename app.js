const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const debug = require('debug')('app');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const nav = [{title: 'Author', link: '/author'}, {title: 'Books', link: '/books'},];
const bookRouter = require('./src/router/bookRouter')(nav);



app.use(morgan('combined'));
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
