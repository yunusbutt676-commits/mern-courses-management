const express = require("express");
const enquiryModel = require("../models/enquiry.model");

// ✅ Add with image and duplicate check
let enquiryRead = async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;
    const image = req.file ? req.file.filename : null; // multer adds file object

    // Duplicate check
    const existing = await enquiryModel.findOne({
      $or: [{ email }, { phone }, { username }]
    });

    if (existing) {
      return res.send({
        status: 0,
        message: "User with same email, phone, or name already exists."
      });
    }

    const enquiry = new enquiryModel({
      username,
      email,
      phone,
      message,
      image // Save image filename
    });

    await enquiry.save();
    res.send({ status: 1, message: "Enquiry Saved Successfully" });

  } catch (err) {
    res.send({ status: 0, message: "Enquiry not Saved", error: err });
  }
};

// View All
let enquiryShow = async (req, res) => {
  try {
    const data = await enquiryModel.find();

    // ✅ Always return array directly for frontend
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch data", error: err });
  }
};


// Delete by ID
let enquiryDelete = async (req, res) => {
  try {
    let enquiryId = req.params.id;
    let deleteEnquiry = await enquiryModel.deleteOne({ _id: enquiryId });

    res.send({
      status: 1,
      msg: "Enquiry Deleted Successfully",
      id: enquiryId,
      delRes: deleteEnquiry
    });
  } catch (err) {
    res.send({ status: 0, msg: "Delete failed", error: err });
  }
};

// Update by ID
let enquiryUpdate = async (req, res) => {
  try {
    let enquiryId = req.params.id;
    const { username, email, phone, message } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateObj = { username, email, phone, message };
    if (image) updateObj.image = image;

    let updateRes = await enquiryModel.updateOne({ _id: enquiryId }, updateObj);

    res.send({
      status: 1,
      msg: "Data Updated Successfully",
      updateRes
    });
  } catch (err) {
    res.send({ status: 0, msg: "Update failed", error: err });
  }
};

module.exports = {
  enquiryRead,
  enquiryShow,
  enquiryDelete,
  enquiryUpdate
};
