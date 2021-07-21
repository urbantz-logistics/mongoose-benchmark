const create = async (model, data) => {
    if (!model) return Promise.resolve()
    return model.create(data)
}

const find = async (model) => {
    if (!model) return Promise.resolve()
    return model.find().skip(0).limit(100)
}

module.exports = {
    create,
    find
}