const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const groupRoutes = require('./routes/group.routes');
const testRoutes = require('./routes/test.routes');
const groupMembershipRoutes = require('./routes/groupMembership.routes');
const questionRoutes = require('./routes/question.routes');
const answerOptionRoutes = require('./routes/answerOption.routes');
const attemptRoutes = require('./routes/attempt.routes');
const answerRoutes = require('./routes/answer.routes');


const { verifyToken } = require('./middleware/authJwt');

const fs = require('fs');
const path = require('path');

const app = express();

const corsOptions = {
    origin: 'http://localhost:8000'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api', groupRoutes);
app.use('/api', groupMembershipRoutes);
app.use('/api', testRoutes);
app.use('/api', questionRoutes);
app.use('/api', answerOptionRoutes);
app.use('/api', attemptRoutes);
app.use('/api', answerRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const uploadsDir = path.join('/var/data', 'uploads', 'dashboards');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const questionUploadsDir = path.join('/var/data', 'uploads', 'questions');
if (!fs.existsSync(questionUploadsDir)) {
    fs.mkdirSync(questionUploadsDir, { recursive: true });
}


app.use('/uploads/questions', express.static(questionUploadsDir));
app.use('/uploads/dashboards', express.static(uploadsDir));

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
