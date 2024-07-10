const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:10000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Test: {
          type: 'object',
          required: ['name'],
          properties: {
            test_id: {
              type: 'integer',
            },
            group_id: {
              type: 'integer',
            },
            name: {
              type: 'string',
            },
            time_open: {
              type: 'string',
              format: 'date-time',
            },
            duration_minutes: {
              type: 'integer',
            },
            max_attempts: {
              type: 'integer',
            },
          },
          example: {
            group_id: 1,
            name: 'Midterm Exam',
            time_open: '2024-06-01T10:00:00Z',
            duration_minutes: 90,
            max_attempts: 3,
          },
        },
        Question: {
          type: 'object',
          required: ['question_text', 'test_id'],
          properties: {
            question_id: {
              type: 'integer',
            },
            test_id: {
              type: 'integer',
            },
            question_text: {
              type: 'string',
            },
            hint: {
              type: 'string',
            },
          },
          example: {
            test_id: 1,
            question_text: "<p>If (a, b) is a solution to the following system of inequalities, which of the following represents the minimum value of b?</p><p><code>y &gt; 2(x-3) + 5</code><br><code>y &lt; x + 3</code></p>",
            hint: "Think about the intersection of the two inequalities.",
          },
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
