const {Schema, model} = require('mongoose');

const shippingAddressSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: [true, 'Name is required'],
        minLength: [3, 'Name minimum length 3 character'],
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    mobile: {
        type: String,
    },


}, {timestamps: true, versionKey: false});

const ShippingAddress = model('ShippingAddress', shippingAddressSchema);

module.exports = ShippingAddress;