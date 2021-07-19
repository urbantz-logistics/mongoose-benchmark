const Benchmark = require('benchmark');
const mongooseV5017 = require('mongoose5.0.17')
const mongooseV5133 = require('mongoose5.13.3')
const smallSchema = require('./fixtures/small-schema')


const MONGODB_4_URI = 'mongodb://mongodb4'
const MONGODB_5_URI = 'mongodb://mongodb5'

const run = async () => {
    const suite = new Benchmark.Suite('mongoose-benchmark', {
        maxTime: 1
    });
    suite.add('MongooseV5017 small schema insert', await smallSchema(MONGODB_4_URI, mongooseV5017))
    suite.add('MongooseV5133 small schema insert', await smallSchema(MONGODB_4_URI, mongooseV5133))

    suite
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        .run({'async': true});

}

run()
