const express       = require('express');
const mongoose      = require('mongoose');
const morgan        = require('morgan');
const cors = require('cors');
const axios = require('axios');

const PollRoute = require('./routes/PollRoute');
const AuthRoute = require('./routes/Auth')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://97.87.8.198:27017/pollme', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('Database Connection Established!');
});

const app = express();


var corsOptions = {
    origin: 'http://97.87.8.198:5173',
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
};

app.use(cors(corsOptions));


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.post("/verify-token", async (req,res) => {
    try{
        let token = req.body.newToken.token;
        let secretKey = token;
        
        // replace APP_SECRET_KEY with your reCAPTCHA secret key
        let response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
        return res.status(200).json({
            success:true,
            message: "Token successfully verified",
            data: response.data
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Error verifying token"
        })
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use('/api/poll', PollRoute);
app.use('/api', AuthRoute);