import express, { type Application, type Request, type Response } from "express";
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('DevPulse Project!')
})

// app.use("/api/users");

export default app;