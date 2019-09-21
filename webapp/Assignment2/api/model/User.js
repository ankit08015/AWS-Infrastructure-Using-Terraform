const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true,
    //     min: 6,
    //     max: 255
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     max: 255,
    //     min: 6, 
    //     unique: true, 
    //     match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    // },
    // password: {
    //     type: String,
    //     required: true,
    //     max: 1024,
    //     min: 6
    // },
    // date: {
    //     type: Date,
    //     default: Date.now
    // }

    //_id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
