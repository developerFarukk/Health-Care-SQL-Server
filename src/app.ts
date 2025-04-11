

import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
// import { AppointmentService } from './app/modules/Appointment/appointment.service';
// import cron from 'node-cron'
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';

const app: Application = express();


// Parser
// app.use(express.json());

app.use(cors())
app.use(cookieParser());
// app.use(cors({ origin: ['http://localhost:5001'], credentials: true }));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// cron.schedule('* * * * *', () => {
//     try {
//         AppointmentService.cancelUnpaidAppointments();
//     }
//     catch (err) {
//         console.error(err);
//     }
// });

app.get('/', (req: Request, res: Response) => {
    res.send({
        success: true,
        Message: "Running Health care server.."
    })
});

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})

export default app;