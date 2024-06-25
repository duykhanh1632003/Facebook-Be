"use strict";

const { apiKey } = require("../models/apikey.model");

const findById = async (key) => {
  try {
    const newKey = await apiKey.findOne({ key ,status: true}).lean();
    return newKey;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }
};

module.exports = {
  findById,
};
