const express = require('express')
const app = express()

app.get('/user', (req, res) => {
    res.json({name: '阿白Smile'})
})
app.listen(3000)