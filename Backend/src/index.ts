import express from 'express';
import type { Request, Response } from 'express';

const PORT = 3000;
const app = express();

app.get("/", ( req : Request , res: Response ) => {
    res.send("Hello from Merrill!")
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}.`);
})