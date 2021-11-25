const express = require('express');
const sgMail = require('@sendgrid/mail')
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));



app.listen(4000);
console.log('Server on port', 4000);

   
