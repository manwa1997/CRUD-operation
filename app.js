const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
app.set('view engine', 'ejs')
const mongoose = require('mongoose');
const Quote = require('./models/quoteschema')
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

mongoose.connect('mongodb+srv://manwarabaya:manwa4@cluster0.cd5hj.mongodb.net/quotesDB?retryWrites=true&w=majority')
  .then(result => {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.post('/quotes', (req, res) => {
      const qoute = new Quote(req.body);
      qoute.save(
        res.redirect('/quotes')
      ).then(result).catch((err => {
        console.log(err);
      }))
    })
    app.put('/quotes', (req, res) => {

      Quote.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
          if (res.ok)
            return res.json()
        })
        .catch(error => console.error(error))

    })
    app.get('/quotes', (req, res) => {
      Quote.find().then((result1) => {
        res.render("index", { quotes: result1 });
      }).catch((err) => {
        console.log(err);
      });

    })

    app.delete('/quotes', (req, res) => {
      Quote.deleteOne(
        { name: req.body.name }
      ).then(result => {
        
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vadar's quote`)
      })
        .catch(error => console.error(error))
    })
    app.listen(port, () => {
      console.log("listen on port " + port)
    });
  }).catch(err => {
    console.log(err);
  });