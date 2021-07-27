const express = require("express");

exports.index = function(req,res){
  res.send("i am in controller route");
}
