const express = require('express'); 
const cors = require('cors');
const { sequelize } = require('./models');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');


const {verifyToken} = require('./middleware/authJwt');

const app = express();

var corsOptions = {
    origin: 'http://localhost:8000'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
});

//check token
app.get("/api/auth/checkToken", [verifyToken], (req, res) => {
    res.status(200).send({ message: "Token is valid!", userId: req.userId, userRole: req.userRole });
});



app.use('/api/auth', authRoutes);

sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
