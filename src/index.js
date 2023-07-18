const express = require("express");
const app = express();

const userRouter = require('./routes/user/citizen');
const authRouter = require('./routes/auth');
const passwordRouter = require('./routes/password');
const appointmentRouter = require('./routes/appointment');
const politicianRouter = require('./routes/user/politician');
const opinionRouter = require('./routes/opinion')

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/password',passwordRouter);
app.use('/appointment',appointmentRouter);
app.use('/politician',politicianRouter);
app.use('/opinion',opinionRouter);

app.listen(3307,()=>{
    console.log("Server is running ...")
})