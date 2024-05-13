const express = require('express'); 
const cors = require('cors');
const {sequelize} = require('./models')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');

const app = express();

var corsOptions = {
    origin: 'http://localhost:8000'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


const db = require("./models");



app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
});



app.get("/api/users", (req, res) => {
    db.user.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}
);

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
