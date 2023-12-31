const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


//BASES DE DONNNEES MONGODB
mongoose.connect(process.env.MONGODB_USER,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(express.json()); // Permet de traiter les données JSON reçues de manière fonctionnelle.


//ERREUR CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


app.use("/images", express.static(path.join(__dirname, 'images')))


module.exports = app;