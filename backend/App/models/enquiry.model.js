let express = require("express");
let mongoose = require("mongoose");

let userEnquirySchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\.(jpg|jpeg|png)$/i.test(v) || /^data:image\/(png|jpeg|jpg);base64,/.test(v) || /^[\w\-]+\.(jpg|jpeg|png)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image format! Must be a .jpg, .jpeg, .png or base64 image.`
    }
  }
});

let enquiryModel = mongoose.model("courses", userEnquirySchema);
module.exports = enquiryModel;
