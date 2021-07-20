const create = async (model, data) => {
    return async () => {
        await model.create(data)
    }
}

const find = async (model) => {
    return async () => {
        await model.find().skip(0).limit(100)
    }
}

module.exports = {
    create,
    find
}