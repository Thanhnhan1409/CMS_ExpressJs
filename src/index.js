const express = require("express");
const cors = require('cors');
const app = express();

const userRouter = require('./routes/user/citizen');
const authRouter = require('./routes/auth');
const passwordRouter = require('./routes/password');
const appointmentRouter = require('./routes/appointment');
const politicianRouter = require('./routes/user/politician');
const opinionRouter = require('./routes/opinion')
const requirementRouter = require('./routes/requirement');
const notificationRouter = require('./routes/notification')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/password',passwordRouter);
app.use('/appointment',appointmentRouter);
app.use('/politician',politicianRouter);
app.use('/opinion',opinionRouter);
app.use('/requirement',requirementRouter);
app.use('/notification',notificationRouter);


app.listen(3307,()=>{
    console.log("Server is running ...")
})