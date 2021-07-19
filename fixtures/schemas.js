const smallSchema = {
    createdAt:{
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },

    expire:{
        type: Date,
        required: true,
        index: true
    },

    isActive:{
        type: Boolean,
        required: true,
        default: true,
        index: true
    }
}

const bigSchema = {
    associatedName: { type: String, maxlength: 255 },
    carrierAssociationRejected: { type: Boolean, default: null },
    attachments: [
        {
            name: String,
            url: String,
            date: Date,
            templateName: String,
        },
    ],
    trackingId: { type: String, maxlength: 255 },

    roundName: { type: String, maxlength: 255 },
    roundColor: { type: String },
    sequence: { type: Number },
    initialSequence: { type: Number },
    targetFlux: { type: String, maxlength: 255 },

    numberOfPlannings: { type: Number, default: 0 },
    date: { type: Date },
    shift: { type: String, maxlength: 32 },
    timeWindowMargin: { type: Number, default: 0 },
    anon: { type: Boolean },
    dimensions: Object,

    review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        when: { type: Date },
    },

    priority: { type: Number },
    optimizationGroup: { type: String, maxlength: 255 },
    optimizationCount: { type: Number, default: 0 },
    pending: { type: Date },
    hasBeenPaid: { type: Boolean, default: null },
    started: { type: Date },

    arriveTime: { type: Date },
    computedArriveTime: { type: Date },
    computedDepartureTime: { type: Date },
    actualTime: {
        arrive: {
            when: { type: Date },
            location: {
                type: { type: String, default: 'Point' },
                geometry: [{ type: Number }],
            },
            forced: { type: Boolean },
            isCorrectAddress: { type: Boolean },
        },
    },
    measuredServiceTime: {
        durationSeconds: { type: Number },
        isLastOfRound: { type: Boolean },
        areTrackingDataSuitable: { type: Boolean },
    },

    maxTransitTime: { type: Number },

    closureDate: { type: Date, default: null },
    lastOfflineUpdatedAt: { type: Number, default: null },
    issues: [
        {
            type: { type: String, enum: ['GEOCODING', 'VALIDATION'] },
            code: Number,
            line: Number,
            error: String,
            identifier: String,
        },
    ],
    replanned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    setToInvoice: { type: Boolean, default: false },

    paymentType: { type: String, enum: ['CCOD', 'COD', null], default: null },
    collectedAmount: { type: Number, default: 0 },

    customerCalls: [
        {
            when: { type: Date, default: null },
        },
    ],

    // MAF didn't want to use flows but they wanted to filter tasks based on the type of services they provide (B2B, food, etc.)
    category: { type: String },
    categories: [{ type: String }],
    collect: {
        activated: { type: Boolean, default: false },
        point: { type: String },
        pointName: { type: String },
        collectSince: { type: Date },
    },
    contactless: {
        pin: { type: String, maxlength: 4 },
    },
    assets: {
        deliver: [
            {
                assetId: { type: String, required: true, maxlength: 255 },
                name: { type: String, required: true, maxlength: 255 },
                price: { type: Number, required: true },
                amount: { type: Number, required: true },
            },
        ],
        return: [
            {
                assetId: { type: String, required: true, maxlength: 255 },
                name: { type: String, required: true, maxlength: 255 },
                price: { type: Number, required: true },
                amount: { type: Number, required: true },
            },
        ],
    },}

module.exports = {
    smallSchema,
    bigSchema
}


