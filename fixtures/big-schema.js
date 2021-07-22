const Benchmark = require('benchmark');
const mongooseV5017 = require('mongoose5.0.17')
const mongooseV5133 = require('mongoose5.13.3')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const mongooseLeanDefaultsPlugin = require('../utils/mongoose-lean-defaults')
const {bigSchema, usersSchema} = require('./schemas');
const {create, findAndPopulate} = require('../utils/mongoose')
const slowQueryProfiler = require('../utils/profiler');

mongooseV5017.plugin(slowQueryProfiler.register);
mongooseV5133.plugin(slowQueryProfiler.register);

const taskData = {
    associatedName: 'test',
    attachments: [{
        name: 'String',
        url: 'String',
        date: Date.now(),
        templateName: 'String',
    }],
    trackingId: 'test',
    roundName: 'testing',
    roundColor: 'ccc',
    sequence: 1,
    initialSequence: 1,
    targetFlux: 'test',

    numberOfPlannings: 2,
    date: Date.now(),
    shift: 'test',
    timeWindowMargin: 2,
    anon: false,
    dimensions: {},
    review: {
        rating: 1,
        comment: 'lorem ipsum',
        when: Date.now(),
    },

    priority: 1,
    optimizationGroup: 'testing',
    optimizationCount: 1,
    pending: Date.now(),
    hasBeenPaid: false,
    started: Date.now(),
    arriveTime: Date.now(),
    computedArriveTime: Date.now(),
    computedDepartureTime: Date.now(),
    actualTime: {
        arrive: {
            when: Date.now(),
            location: {
                type: 'point',
                geometry: [1, 2],
            },
            forced: false,
            isCorrectAddress: false,
        },
    },
    measuredServiceTime: {
        durationSeconds: 1,
        isLastOfRound: false,
        areTrackingDataSuitable: false,
    },

    maxTransitTime: 1,

    closureDate: Date.now(),
    lastOfflineUpdatedAt: 1,
    issues: [
        {
            type: 'VALIDATION',
            code: 111,
            line: 1,
            error: 'test',
            identifier: 'test',
        },
    ],
    replanned: false,
    archived: false,
    setToInvoice: false,

    paymentType: null,
    collectedAmount: '1',

    customerCalls: [
        {
            when: Date.now(),
        },
    ],

    category: 'CAT',
    categories: ['CAT', 'DOG'],
    collect: {
        activated: false,
        point: 'test',
        pointName: 'test',
        collectSince: Date.now(),
    },
    contactless: {
        pin: '1234',
    },
    assets: {
        deliver: [
            {
                assetId: 'testing',
                name: 'testing',
                price: 11,
                amount: 1,
            },
        ],
        return: [
            {
                assetId: 'testing',
                name: 'string',
                price: 1,
                amount: 11,
            },
        ],
    },
}

const getSchemas = async (mongoUri) => {
    await mongooseV5017.connect(mongoUri);
    await mongooseV5133.connect(mongoUri);
    const schemaV5017BigSchema = mongooseV5017.Schema(bigSchema);
    const schemaV5133BigSchema = mongooseV5133.Schema(bigSchema);
    const schemaV5017UsersSchema = mongooseV5017.Schema(usersSchema);
    const schemaV5133UsersSchema = mongooseV5133.Schema(usersSchema);
    return [schemaV5017BigSchema, schemaV5133BigSchema, schemaV5017UsersSchema, schemaV5133UsersSchema].map(
        schema => {
            schema.plugin(mongooseLeanDefaultsPlugin);
            schema.plugin(mongooseLeanVirtuals);
            return schema;
        }
    )
};

const bigSchemaCreateBenchmark = async (mongoUri) => {
    const suite = new Benchmark.Suite(`big-schema-create ${mongoUri}`, {
        maxTime: 1
    });
    const [schemaV5017BigSchema, schemaV5133BigSchema, schemaV5017UsersSchema, schemaV5133UsersSchema] = await getSchemas(mongoUri);

    const modelV5017 = mongooseV5017.model('BigSchemaModel', schemaV5017BigSchema);
    const modelV5133 = mongooseV5133.model('BigSchemaModel', schemaV5133BigSchema)
    const modelUsersV5017 = mongooseV5017.model('UsersSchemaModel', schemaV5017UsersSchema)
    const modelUsersV5133 = mongooseV5133.model('UsersSchemaModel', schemaV5133UsersSchema)

    suite.add('MongooseV5017 insert', {
        defer: true,
        fn: async function (deferred) {
            const refRes = await create(modelUsersV5017, taskData);
            create(modelV5017, { ...taskData, refId: refRes._id }).then(() => deferred.resolve())
        }
    })

    suite.add('MongooseV5133 insert', {
        defer: true,
        fn: async function (deferred) {
            const refRes = await create(modelUsersV5133, taskData);
            create(modelV5133, { ...taskData, refId: refRes._id }).then(() => deferred.resolve())
        }
    })

    return new Promise((resolve, reject) => {
        suite
            .on('cycle', function (event) {
                console.log(String(event.currentTarget.name), String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                delete mongooseV5133.connection.models['BigSchemaModel'];
                delete mongooseV5017.connection.models['BigSchemaModel'];
                delete mongooseV5133.connection.models['UsersSchemaModel'];
                delete mongooseV5017.connection.models['UsersSchemaModel'];
                mongooseV5017.disconnect();
                mongooseV5133.disconnect();
                resolve()
            }).run({'async': true});
    })

}

const bigSchemaFindBenchmark = async (mongoUri) => {
    const suite = new Benchmark.Suite(`big-schema-find ${mongoUri}`, {
        maxTime: 1
    });
    const [schemaV5017BigSchema, schemaV5133BigSchema, schemaV5017UsersSchema, schemaV5133UsersSchema] = await getSchemas(mongoUri);
    const modelV5017 = mongooseV5017.model('BigSchemaModel', schemaV5017BigSchema)
    const modelV5133 = mongooseV5133.model('BigSchemaModel', schemaV5133BigSchema)
    mongooseV5017.model('UsersSchemaModel', schemaV5017UsersSchema)
    mongooseV5133.model('UsersSchemaModel', schemaV5133UsersSchema)

    suite.add('MongooseV5017 find', {
        defer: true,
        fn: async function (deferred) {
            findAndPopulate(modelV5017).then(() => deferred.resolve())
        }
    })

    suite.add('MongooseV5133 find', {
        defer: true,
        fn: async function (deferred) {
            findAndPopulate(modelV5133).then(() => deferred.resolve())
        }
    })

    return new Promise((resolve, reject) => {
        suite
            .on('cycle', function (event) {
                console.log(String(event.currentTarget.name), String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                delete mongooseV5133.connection.models['BigSchemaModel'];
                delete mongooseV5017.connection.models['BigSchemaModel'];
                delete mongooseV5133.connection.models['UsersSchemaModel'];
                delete mongooseV5017.connection.models['UsersSchemaModel'];
                mongooseV5017.disconnect();
                mongooseV5133.disconnect();
                resolve()
            }).run({'async': true});
    })
}

module.exports = {
    bigSchemaCreateBenchmark,
    bigSchemaFindBenchmark
}