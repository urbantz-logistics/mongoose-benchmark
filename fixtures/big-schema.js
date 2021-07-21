const Benchmark = require('benchmark');
const mongooseV5017 = require('mongoose5.0.17')
const mongooseV5133 = require('mongoose5.13.3')

const {bigSchema} = require('./schemas');
const {create, find} = require('../utils/mongoose')

let mongooseV5017BigSchemaTestInit = false;
let mongooseV5133BigSchemaTestInit = false;
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
    optimizationGroup:'testing',
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
                geometry: [1,2],
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

const bigSchemaCreateBenchmark = async (mongoUri) => {
    const suite = new Benchmark.Suite(`big-schema-create ${mongoUri}`, {
        maxTime: 1
    });
    await mongooseV5017.connect(mongoUri);
    await mongooseV5133.connect(mongoUri);

    suite.add('MongooseV5017 insert', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5017BigSchemaTestInit) {
                mongooseV5017BigSchemaTestInit = true;
                model = mongooseV5017.model('BigSchemaModel', mongooseV5017.Schema(bigSchema))
            }
            create(model, taskData).then(() => deferred.resolve())
        }
    })

    suite.add('MongooseV5133 insert', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5133BigSchemaTestInit) {
                mongooseV5133BigSchemaTestInit = true
                model = mongooseV5133.model('BigSchemaModel', mongooseV5133.Schema(bigSchema))
            }
            create(model, taskData).then(() => deferred.resolve())
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
                mongooseV5017.disconnect();
                mongooseV5133.disconnect();
                mongooseV5017BigSchemaTestInit = false;
                mongooseV5133BigSchemaTestInit = false;
                resolve()
            }).run({'async': true});
    })

}

const bigSchemaFindBenchmark = async (mongoUri) => {
    const suite = new Benchmark.Suite(`big-schema-find ${mongoUri}`, {
        maxTime: 1
    });
    await mongooseV5017.connect(mongoUri);
    await mongooseV5133.connect(mongoUri);
    suite.add('MongooseV5017 find', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5017BigSchemaTestInit) {
                mongooseV5017BigSchemaTestInit = true;
                model = mongooseV5017.model('BigSchemaModel', mongooseV5017.Schema(bigSchema))
            }
            find(model).then(() => deferred.resolve())
        }
    })

    suite.add('MongooseV5133 find', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5133BigSchemaTestInit) {
                mongooseV5133BigSchemaTestInit = true
                model = mongooseV5133.model('BigSchemaModel', mongooseV5133.Schema(bigSchema))
            }
            find(model).then(() => deferred.resolve())
        }
    })

    return new Promise((resolve, reject) => {
        suite
            .on('cycle', function (event) {
                console.log(String(event.currentTarget.name), String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                mongooseV5017BigSchemaTestInit = false;
                mongooseV5133BigSchemaTestInit = false;
                mongooseV5017.disconnect();
                mongooseV5133.disconnect();
                delete mongooseV5133.connection.models['BigSchemaModel'];
                delete mongooseV5017.connection.models['BigSchemaModel'];
                resolve()
            }).run({'async': true});
    })
}

module.exports = {
    bigSchemaCreateBenchmark,
    bigSchemaFindBenchmark
}