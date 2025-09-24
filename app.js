if(process.env.NODE_ENV != "production"){ // iska mtlb h ki hum .env file ko tab tk use kr skte h,
//  jab tak node environment production nhi h,
//  we'll set it later, also we don't upload our .env file anywhere
  require('dotenv').config() // then process.env se khi bhi use kr skte h .env file m saved credentials
}

const express = require("express");
const app = express();  
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // for templates
const ExpressError = require("./utils/expressError");
// const cookieParser = require("cookie-parser"); // to use cookies

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // using of ejs-mate
app.use(express.static(path.join(__dirname, "public"))); // connecting static files

const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;

main().then(()=> console.log("Connection established")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
//mongo session store
const store = MongoStore.create({ 
  mongoUrl: dbUrl, // db connect, session info will be stored here from now
  crypto: { // for encryption of session information
    secret: secret
  }  
  ,touchAfter: 24 * 3600 // ki kitne time tk save rhe info
  })

store.on("error", () => {
  console.log("Error in mongo Session Store", err)
})

//session options
const sessionOptions = {
  store:store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // one week time like 7 days, then each day has 24 hrs, then each hrs has 60 mins, that's how we calculate
    maxAge: 7 * 24 * 60 * 60 * 1000, //maxAge
    httpOnly:true
  }
}
//Root path
// app.get("/", (req,res) => { 
//     res.send("Root is online now");
// });

app.use(session(sessionOptions)); //using session for website
app.use(flash()); // for flash messages

//have to write these two lines
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// mtlb users local strategy k through authenticate hone chahiye

//User yha pe hamaara user.js wala model h

passport.serializeUser(User.serializeUser()); // have to use these two lines as well
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // this will store info of current user, because we can't access req.user directly in ejs
  
  next();
})

// for routers
app.use("/listings", listingRouter) 
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

// if the route doesn't exist
app.all("*", (req,res,next) => {
  next(new ExpressError(404,"Page Not Found!"));
})  

//error-handling middleware
app.use((err,req,res,next) => {
  let {status = 500,message = "Something Went Wrong!"} = err;
  res.status(status).render("error.ejs", {message})
})

//port
let port = process.env.PORT || 10000
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})
