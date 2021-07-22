
module.exports = (app, fs, Book) => {

    app.get('/', (req, res) => {
        res.render('index.js');
    });

    app.get('/data', (req, res) => {

        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', (err, data) => {
            console.log(data);
            res.end(data);
        })
    })

    app.get('/getUser/:username', (req, res) => {

        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', (err, data) => {
            const users = JSON.parse(data);
            res.json(users[req.params.username]);
        })
    })


    app.post('/addUser/:username', (req, res) => {

        var result = {};

        const get_userName = req.params.username;

        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', (err, data) => {
            const users = JSON.parse(data);
            if (users[get_userName]) {
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return 0;
            }

            users[get_userName] = req.body;

            fs.writeFile(__dirname + "/../data/" + "user.json", JSON.stringify(users, null, '\t'), 'utf8', (err, data) => {
                result = { "success": 1 };
                res.json(result);
            })
        })

    })

    app.get('/session', (req, res) => {
        sess = req.session;
        sess.username = "vv";
        console.log(sess.username);
        res.render('index.js');
    })


    app.post('/api/books', (req, res) => {
        const book = new Book();
        book.title = req.body.name;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);

        book.save((err) => {
            if (err) {
                console.log(err);
                res.json({ result: 0 });
                return;
            }

            res.json({ result: 1 });
        })
    })


    app.get('/api/books', (req, res) => {
        Book.find((err, books) => {
            if (err) {
                return res.status(500).send({
                    errror: 'database failure'
                });
            }
            res.json(books);
        })
    });

    app.get('/api/books/:author', (req, res) => {
        Book.findOne({ author: req.params.author }, (err, books) => {
            if (err) {
                console.log("error");
                return;
            }

            res.json(books.author);
        })
    })

    app.put('/api/books/:author', (req, res) => {
        Book.update({ author: req.params.author }, {$set: req.body}, (err, books) => {
            if (err)
                return res.status(500).json({ error: 'database failure' });
            if (!books)
                return res.status(404).json({ error: 'book not found' });

            if (req.body.author) books.author = req.body.author;
            
            res.json({message: 'book update'});
        })
    })

    app.delete('/api/books/:author', (req, res) => {
        Book.remove({author: req.params.author}, (err, output) => {
            
            console.log("delete Data");
            if(err)
                console.log(err);
            res.status(204).end(output);
        })
    })




}