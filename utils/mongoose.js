const create = async (model, data) => {
    return model.create(data)
}

const find = async (model) => {
    return model.find().skip(0).limit(100)
}

const findAndPopulate = async (model) => {
    return model.find().sort({ date: -1 }).lean().populate('refId').skip(0).limit(100)
}

module.exports = {
    create,
    find,
    findAndPopulate
}