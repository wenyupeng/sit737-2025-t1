const express = require('express');
const logger = require('./logger-init');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/contents', (req, res) => {
    logger.info('GET /contents endpoint called');
    const contents = [
        { id: 1, title: 'Content 1', description: 'Containerize a simple application' },
        { id: 2, title: 'Content 2', description: 'Deploy the containerized application' },
        { id: 3, title: 'Content 3', description: 'To ensure proper monitoring and visibility of cloud-native application' },
    ];

    logger.info('Contents retrieved successfully');
    res.json(contents);
}
);


app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});