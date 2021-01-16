import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'


// For development mode ONLY. *** Comment out for production***
import devBundle from './devBundle'

const app = express();

// For development mode ONLY. *** Comment out for production***
devBundle.compile(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());


app.use('/', userRoutes);
app.use('/', authRoutes);



// app.get('/', (req, res) => {
// 	res.status(200).send(Template());
// });



// express-jwt throws an error named UnauthorizedError when a token cannot be validated.
// That error is caught here and the appropriate response is sent to the client:
app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({
			"error": err.name + ": " + err.message
		});
	}
	else if (err) {
		res.status(400).json({
			"error": err.name + ": " + err.message
		});
	}
})

export default app