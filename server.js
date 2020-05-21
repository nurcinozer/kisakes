const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

require('dotenv').config();

mongoose.connect(process.env.DB_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', async(req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
});

app.post('/shortUrls', async(req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
});

app.get('/:shortUrl', async(req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
        shortUrl.save()

    res.redirect(shortUrl.full)
});

app.set( 'port', ( process.env.PORT || 5000 ));

app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
});
