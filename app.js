//.dotenv-package
require('dotenv').config();
//express-async-errors
require('express-async-errors')
//express-package
const express = require('express');
const app = express();
//morgan-package
const morgan = require('morgan');
const cookiParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//DateBase
const connectDB = require('./db/connect')
//importingRoutes
const authRouters = require('./routes/auth')
const userRouters = require('./routes/user')
const productRouters = require('./routes/Product')
const reviewRouters = require('./routes/reviewRoute')
const orderRouters = require('./routes/orderRoute')

//ImportingMiddleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const cookieParser = require('cookie-parser');
//toGetMoreDataForEachRoute
app.use(morgan('tiny'))
//req.body
app.use(express.json())
//ToGetTheCookies
app.use(cookieParser(process.env.JWT_SECRET))
//presentFrontEndFiles
app.use(express.static('./public'))
//uploadImage
app.use(fileUpload());



//routes
app.get('/', (req, res) => {
 res.send('e-commerce api')
})

app.get('/api/v1', (req, res) => {
 console.log(req.signedCookies)
 res.send('E-commerce Api')
})

// routeWithExtension   
app.use('/api/v1/auth', authRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/product', productRouters)
app.use('/api/v1/review', reviewRouters)
app.use('/api/v1/order', orderRouters)

//activate(NotFoundMiddleware, errorHandlerMiddleware)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//presentationOurData
const port = process.env.PORT || 3500
const start = async (req, res) => {
 try {
  await connectDB(process.env.MONGO_URI)
  app.listen(port, console.log(`Server is listening on port ${port}....`))
 } catch (error) {
  console.log(error)
 }
}

start();