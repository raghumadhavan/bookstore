const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:booController')

function bookController(nav) {

    function getIndex(req,res)  {

        const url = 'mongodb://127.0.0.1:27017';
        const dbName = 'bookStore';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server')

                const db = client.db(dbName);

                const col = await db.collection('books')

                const books = await col.find().toArray();

                res.render('booksList', {
                    title: 'Bookstore',
                    nav,
                    books
                });
            } catch (err) {
                debug(err.stack)
            }
            client.close();
        }());

        // (async function query(){
        //     const request = new sql.Request()
        //     const { recordset } = await request.query('select * from books')
        //         res.render('booksList',{
        //             title: 'Bookstore',
        //             nav,
        //             books: recordset
        //         });
        // }())


    }
    function getById(req,res) {
        const { id } = req.params;
        const url = 'mongodb://127.0.0.1:27017';
        const dbName = 'bookStore';
        (async function mongo(){

            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server')

                const db = client.db(dbName);

                const col = await db.collection('books')

                const book = await col.findOne({_id:new ObjectID(id)})

                res.render('book', {
                    title: 'Bookstore',
                    nav,
                    book
                });
            } catch (err) {
                debug(err.stack)
            }
            client.close();

        }())


    }

    function middleware(req, res, next) {
        if(req.user) {
            next();
        } else {
            res.redirect('/')
        }
    }

    return {
        getIndex,
        getById,
        middleware
    }
}

module.exports = bookController;
