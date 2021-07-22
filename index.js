const {smallSchemaFindBenchmark, smallSchemaCreateBenchmark} = require('./fixtures/small-schema')
const {bigSchemaFindBenchmark, bigSchemaCreateBenchmark} = require('./fixtures/big-schema')

const MONGODB_4_URI = 'mongodb://mongodb4'
const MONGODB_5_URI = 'mongodb://mongodb5'

const run = async () => {
    // await smallSchemaCreateBenchmark(MONGODB_4_URI)
    // await smallSchemaCreateBenchmark(MONGODB_5_URI)

    // await smallSchemaFindBenchmark(MONGODB_4_URI)
    // await smallSchemaFindBenchmark(MONGODB_5_URI)

    // await bigSchemaCreateBenchmark(MONGODB_4_URI)
    // await bigSchemaCreateBenchmark(MONGODB_5_URI)

    // await bigSchemaFindBenchmark(MONGODB_4_URI)
    await bigSchemaFindBenchmark(MONGODB_5_URI)
}

run()