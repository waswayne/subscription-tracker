import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    price: {
        type: Number,
        required: [true, 'Subscription is required'],
        min: [0, 'Price must be greater than 0']
    },
    currency: {
        type: String,
        enum: ['NAIRA', 'USD', 'EUR', 'GBP'],
        default: 'NAIRA'
    },
    category: {
        type: String,
        enum: ['sports', 'business', 'finance', 'political', 'others']
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Start date must be in the past',
        }
    },
    renewDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, {timestamps: true});

subscriptionSchema.pre('save', function (next) {
    if (!this.renewDate && this.startDate && this.frequency) {
        const renewPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        this.renewDate = new Date(this.startDate);
        this.renewDate.setDate(this.renewDate.getDate() + renewPeriods[this.frequency]);
    }
    if (this.renewDate && this.renewDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;