const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filteredUser=users.filter((user)=>{
        return user.name === username;
    })
    if(filteredUser.length > 0) return true;
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if(isValid(username)){
        let validUser = users.filter((user)=>{
            return(user.username === username && user.password === password);
        })
        if(validUser.length > 0) return true;
        return false;
    }
    else{
        res.status(404).send("User does not exist, please register first");
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.params.username;
  const password = req.params.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!isbn || !review || !username) {
    return res.status(400).send("Invalid request");
  }

  let targetBook = books[isbn];
  if (!targetBook) {
    return res.status(404).send("Book not found");
  }

  const userReviews = targetBook.reviews.filter((r) => r.username === username);

  if (userReviews.length > 0) {
    userReviews[0].review = review;
    return res.send("Review modified successfully");
  }

  const newReview = {
    "username":username,
    "review":review,
  };
  targetBook.reviews.push(newReview);
  return res.send("Review added successfully");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!isbn || !username) {
      return res.status(400).send("Invalid request"); 
    }
  
    let targetBook = books[isbn];
    if (!targetBook) {
      return res.status(404).send("Book not found"); 
    }
  
    const initialReviewsCount = targetBook.reviews.length;
  
    targetBook.reviews = targetBook.reviews.filter((review) => review.username !== username);
  
    if (targetBook.reviews.length < initialReviewsCount) {
      return res.send("Review deleted successfully");
    }
  
    return res.status(404).send("Review not found"); 
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
