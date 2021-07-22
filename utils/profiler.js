const threshold = parseInt(
	process.env.MONGO_PROFILER_THRESHOLD_MS
		? process.env.MONGO_PROFILER_THRESHOLD_MS
		: 10000,
	10
);

let active = false;
const logger = console;

function register(schema) {
	const targetMethods = [
		'find',
		'findOne',
		'count',
		'countDocuments',
		'estimatedDocumentCount',
		'findOneAndUpdate',
		'findOneAndRemove',
		'findOneAndDelete',
		'deleteOne',
		'deleteMany',
		'remove',
	];

	targetMethods.forEach(method => {
		schema.pre(method, preQueryHook);
		schema.post(method, postQueryHook);
	});
}

function preQueryHook(next) {
	if (active) {
		this.__startTime = Date.now();
	}
	return next();
}

function postQueryHook() {
	if (!this.__startTime) {
		return;
	}

	const duration = Date.now() - this.__startTime;

	if (duration < threshold) {
		return;
	}

	logger.info(
		{
			op: this.op,
			collection: this._collection.collectionName,
			duration,
			conditions: this._conditions,
			update: this._update,
			additionalProps: this.__additionalProperties,
		},
		'Slow query detected'
	);
}

module.exports = {
	register,
};
