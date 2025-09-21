const mongoose = require('mongoose');
const { Schema } = mongoose;

const dodopaymentLogSchema = new Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true,
  },
  business_id: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    // required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    // required: true,
  },
  payment_method: {
    type: String,
    default: null,
    // required: true,
  },
  created_at: {
    type: Date,
    // required: true,
  },
  customer: {
    customer_id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  product_cart: [
    {
      product_id: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  payment_link: {
    type: String,
     required: true,
    default: null,
  },
  tax: {
    type: Number,
    default: null,
  },
  settlement_amount: {
    type: Number,
    default: null,
  },
  settlement_tax: {
    type: Number,
    default: null,
  },
  settlement_currency: {
    type: String,
    default: null,
  },
  card_last_four: {
    type: String,
    default: null,
  },
  card_issuing_country: {
    type: String,
    default: null,
  },
  card_type: {
    type: String,
    default: null,
  },
  card_network: {
    type: String,
    default: null,
  },
  digital_products_delivered: {
    type: Boolean,
    default: false,
  },
  error_message: {
    type: String,
    default: null,
  },
  error_code: {
    type: String,
    default: null,
  },
  subscription_id: {
    type: String,
    default: null,
  },
  discount_id: {
    type: String,
    default: null,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
});

export default mongoose.models.DodopaymentLog ||
  mongoose.model("DodopaymentLog", dodopaymentLogSchema);
