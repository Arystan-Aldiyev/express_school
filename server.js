require('dotenv').config();

const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const {sequelize} = require('./models');
const bodyParser = require('body-parser');
const globalRouter = require('./global.router');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
        methods: ["GET", "POST", "DELETE"]
    }
});

const corsOptions = {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', globalRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
    req.io = io;
    console.log('Socket.io instance attached to req');
    next();
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('login', (userId) => {
        socket.userId = userId;
        console.log(`User ${userId} connected`);
    });

    socket.on('notification', (userId, message) => {
        try {
            io.to(userId.toString()).emit('notification', message);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    });

    socket.on('markAsRead', async (data) => {
        const {userId, notificationId} = data;
        try {
            const notification = await Notification.findOne({
                where: {notification_id: notificationId, user_id: userId}
            });
            if (notification) {
                await notification.update({is_read: true});
                io.to(notificationId.toString()).emit('notificationRead', notificationId);
            } else {
                console.error(`Notification ${notificationId} not found for user ${userId}`);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });
});

sequelize.sync()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });