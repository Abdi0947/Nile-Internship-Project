const express = require("express");
const { MongoDBconfig } = require('./lib/mongodbconfig');
const cors = require('cors');
const authrouter = require('./router/Authrouter');
const Teacherrouter = require('./router/Teacherrouter');
const Graderouter=require('./router/Graderouter')
const Notificationrouter=require('./router/Notificationrouter')
const Attendancerouter=require('./router/Attendancerouter')
const Timetablerouter=require('./router/Timetablerouter')
const Feerouter=require('./router/Feerouter')
const Studentrouter=require('./router/StudentRouter')
const Subjectrouter=require('./router/Subjectrouter')
const ClassRouter = require('./router/ClassRouter')
const AssignmentRouter = require('./router/Assigmentrouter')
require("dotenv").config();
const PORT = process.env.PORT || 5003;
const cookieParser = require("cookie-parser");
const app = express();



app.use(cors({
  origin: "http://51.21.182.82", 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));





// Increase payload size limit to 50MB for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());
app.use("/api/auth", authrouter);
app.use("/api/teacher",Teacherrouter)
app.use("/api/grade",Graderouter)
app.use("/api/assignment", AssignmentRouter)
app.use("/api/Notification", Notificationrouter)
app.use("/api/attendance",Attendancerouter)
app.use("/api/Timetable",Timetablerouter)
app.use("/api/Fee",Feerouter)
app.use("/api/student",Studentrouter)
app.use("/api/Subject",Subjectrouter)
app.use("/api/class", ClassRouter)

// app.use((err, req, res, next) => {
//   console.error(
//     "🔥 Global error handler caught:",
//     JSON.stringify(err, null, 2)
//   );
//   res.status(500).json({ error: err.message || "Internal server error" });
// });

app.listen(PORT, () => {
  MongoDBconfig();
  console.log(`The server is running at port ${PORT}`);
});