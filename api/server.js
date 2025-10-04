// server için gerekli olanları burada ayarlayın

// posts router'ını buraya require edin ve bağlayın
const express = require('express');
const cors = require('cors');
const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json());
server.use(cors());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});

module.exports = server;