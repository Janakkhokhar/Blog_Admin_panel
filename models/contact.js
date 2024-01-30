let mongoose = require("mongoose");

let contactSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    Created_date: {
        type: String,
        required: true,
    },
    Updated_date: {
        type: String,
        required: true,
    },
});

let Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact