const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, "product is required"],
      unique: true,
      validate: {
        validator: function(value) {
          return /^[a-zA-Z0-9 ]+$/.test(value);
        },
        message: props => `${props.value} is not a valid`
      },
    },
    color: {
      type: String,
      required: [true, "color is required"],
      enum: {
        values: ["white", "black", "red", "yellow", "green", "blue", "orange"],
        message: "color muse be one of them, white, black, red, yellow, green, blue, orange"
      },
      default: "white"
    },
    price: {
      type: Number,
      required: false,
      default: 0,
      min: [ 0, "price must be larger or equal than 0" ],
      max: [ 9999, "price must be less or equal than 9999" ]
    },
    min_price: {
      type: Number,
      required: false,
      default: 0,
      min: [ 0, "min_price must be larger or equal than 0" ],
      max: [ 9999, "min_price must be less or equal than 9999" ]
    },
    max_price: {
      type: Number,
      required: false,
      default: 0,
      min: [ 0, "max_price must be larger or equal than 0" ],
      max: [ 9999, "max_price must be less or equal than 9999" ]
    },
    discount_time: {
      type: Number,
      required: false,
      default: 0,
      min: [ 0, "discount_time must be larger or equal than 0" ],
      max: [ 9999, "discount_time must be less or equal than 9999" ]
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
      min: [ 0, "rating must be larger or equal than 0" ],
      max: [ 10, "rating must be less or equal than 10" ]
    },
    inventory: {
      type: Number,
      required: false,
      default: 0,
      min: [ 0, "inventory must be larger or equal than 0" ],
      max: [ 9999, "inventory must be less or equal than 9999" ]
    },
    is_active: {
      type: Boolean,
      required: false,
      default: false
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [ 8, "description must have more or equal than 8 character"],
      maxLength: [ 64, "description must have less or equal than 64 character"]
    },
    created_date: {
      type: Date,
      required: false,
      default: Date.now()
    },
    updated_date: {
      type: [Date],
      required: false
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

productSchema.virtual('mid_price')
  .get(function () {
    return Math.floor((this.max_price + this.min_price) / 2);
  });

module.exports = mongoose.model('Product', productSchema);