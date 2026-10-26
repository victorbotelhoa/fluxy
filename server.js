import chalk from 'chalk'
import express from 'express'
const app = express()
const port = 3001

const msg = chalk.hex('#ff6f00')('[Server] | ')

app.use(express.json())

app.listen(port, () => {
    console.log(msg, chalk.hex('#2bff00')('Server on ', port));
    
})

