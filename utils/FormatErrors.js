import _ from 'lodash';

export const formatErrors = (e, models) => {
	if (e.errors.length > 0) {
		return e.errors.map((x) => _.pick(x, ['path', 'message']));
	}
	return [{ path: 'name', message: 'something went wrong' }];
};
