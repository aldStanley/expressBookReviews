const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let filteredUser = users.filter((user)=>{
        return user.username === username;
    });
    if(filteredUser.length > 0) return true;
    return false;
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Successfully registred. You can log in now!"});
    } else {
      return res.status(404).json({message: "You already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{
      if(books){
          res.send(JSON.stringify({books},null,4))
          resolve("Books sent!").then((message)=>{console.log("Action completed,"+message)})
      }
      else{
          reject("There is no books :(").then((message)=>{console.log("Action failed, "+message)})
      }
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let result = books[isbn];
  return new Promise((resolve,reject)=>{
    if(result){
        res.send(JSON.stringify({result},null,4))
        resolve("Book sent!").then((message)=>{console.log("Action completed,"+message)})
    }
    else{
        reject("The book you want is not here :(").then((message)=>{console.log("Action failed, "+message)})
    }
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author;
  let filteredBook = Object.values(books).filter(book=>book.author.includes(authorName));
  return new Promise((resolve,reject)=>{
    if(filteredBook){
        res.send(JSON.stringify({filteredBook},null,4))
        resolve("Book sent!").then((message)=>{console.log("Action completed,"+message)})
    }
    else{
        reject("The book you want is not here :(").then((message)=>{console.log("Action failed, "+message)})
    }
    })
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let filteredBook = Object.values(books).filter(book=>book.title === title);
  res.send(JSON.stringify({filteredBook},null,4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  result = books[isbn].review;
  res.send(JSON.stringify({result},null,4))
});

module.exports.general = public_users;
