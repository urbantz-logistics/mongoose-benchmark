const {smallSchema} = require('./schemas');

module.exports = async (mongodbUri, mongoose) => {

    const SmallSchemaModel = mongoose.model('SmallSchemaModel', mongoose.Schema(smallSchema))

    await mongoose.connect(mongodbUri);

    return async () => {
        await SmallSchemaModel.create({
            createdAt: Date.now(),
            expire: Date.now(),
            isActive: false
        })
    }
}