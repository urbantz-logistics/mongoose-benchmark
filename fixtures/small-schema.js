const Benchmark = require('benchmark');
const mongooseV5017 = require('mongoose5.0.17')
const mongooseV5133 = require('mongoose5.13.3')

const {smallSchema} = require('./schemas');
const {create, find} = require('../utils/mongoose')

let mongooseV5017SmallSchemaTestInit = false;
let mongooseV5133SmallSchemaTestInit = false;


const smallSchemaCreateBenchmark = async (mongoUri) => {
    const suite = new Benchmark.Suite(`small-schema-create ${mongoUri}`, {
        maxTime: 1
    });
    await mongooseV5017.connect(mongoUri);
    await mongooseV5133.connect(mongoUri);
    suite.add('MongooseV5017 insert', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5017SmallSchemaTestInit) {
                mongooseV5017SmallSchemaTestInit = true;
                model = mongooseV5017.model('SmallSchemaModel', mongooseV5017.Schema(smallSchema))
                
            }
            create(model, {
                createdAt: Date.now(),
                expire: Date.now(),
                isActive: false
            }).then(() => deferred.resolve())
        }
    })

    suite.add('MongooseV5133 insert', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5133SmallSchemaTestInit) {
                mongooseV5133SmallSchemaTestInit = true
                model = mongooseV5133.model('SmallSchemaModel', mongooseV5133.Schema(smallSchema))
            }
            create(model, {
                createdAt: Date.now(),
                expire: Date.now(),
                isActive: false
            }).then(() => deferred.resolve())
        }
    })

    return new Promise((resolve, reject) => {
        suite
            .on('cycle', function (event) {
                console.log(String(event.currentTarget.name), String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                delete mongooseV5133.connection.models['SmallSchemaModel'];
                delete mongooseV5017.connection.models['SmallSchemaModel'];
                mongooseV5017.disconnect();
                mongooseV5133.disconnect();
                mongooseV5017SmallSchemaTestInit = false;
                mongooseV5133SmallSchemaTestInit = false;
                resolve()
            }).run({'async': true});
    })

}

const smallSchemaFindBenchmark = async (mongoUri) => {
    const suite = new Benchmark.Suite(`small-schema-find ${mongoUri}`, {
        maxTime: 1
    });
    await mongooseV5017.connect(mongoUri);
    await mongooseV5133.connect(mongoUri);
    suite.add('MongooseV5017 find', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5017SmallSchemaTestInit) {
                mongooseV5017SmallSchemaTestInit = true;
                model = mongooseV5017.model('SmallSchemaModel', mongooseV5017.Schema(smallSchema))
            }
            find(model).then(() => deferred.resolve())
        }
    })

    suite.add('MongooseV5133 find', {
        defer: true,
        fn: async function (deferred) {
            let model
            if (!mongooseV5133SmallSchemaTestInit) {
                mongooseV5133SmallSchemaTestInit = true
                model = mongooseV5133.model('SmallSchemaModel', mongooseV5133.Schema(smallSchema))
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
                mongooseV5017SmallSchemaTestInit = false;
                mongooseV5133SmallSchemaTestInit = false;
                delete mongooseV5133.connection.models['SmallSchemaModel'];
                delete mongooseV5017.connection.models['SmallSchemaModel'];
                mongooseV5017.disconnect();
                mongooseV5133.disconnect();
                resolve()
            }).run({'async': true});
    })
}

module.exports = {
    smallSchemaCreateBenchmark,
    smallSchemaFindBenchmark
}