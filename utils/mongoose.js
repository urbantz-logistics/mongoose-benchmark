const create = async (model, data) => {
    return model.create(data)
}

const find = async (model) => {
    return model.find().skip(0).limit(100)
}

module.exports = {
    create,
    find
}