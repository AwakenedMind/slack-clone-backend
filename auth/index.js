import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
	const createToken = jwt.sign(
		{
			user: _.pick(user, ['id']),
		},
		secret,
		{
			expiresIn: '1h',
		}
	);

	const createRefreshToken = jwt.sign(
		{
			user: _.pick(user, 'id'),
		},
		secret2,
		{
			expiresIn: '7d',
		}
	);
	return [createToken, createRefreshToken];
};

export const refreshTokens = async (token, refreshToken, models, SECRET) => {
	let userId = null;
	try {
		const {
			user: { id },
		} = jwt.decode(refreshToken);
		userId = id;
	} catch (err) {
		return { ok: false, message: 'Invalid user' };
	}

	if (!userId) {
		return { ok: false, message: 'Invalid user' };
	}

	const user = await models.User.findOne({ where: { id: userId }, raw: true });
	console.log(user);
	if (!user) {
		return { ok: false, message: 'Invalid user' };
	}

	try {
		jwt.verify(refreshToken, user.refreshSecret);
	} catch (err) {
		return { ok: false, message: 'Invalid login' };
	}
	const [newToken, newRefreshToken] = await createTokens(
		user,
		SECRET,
		user.refreshSecret
	);

	console.log({
		token: newToken,
		refreshToken: newRefreshToken,
		user,
	});

	return {
		token: newToken,
		refreshToken: newRefreshToken,
		user,
	};
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
	const user = await models.User.findOne({ where: { email }, raw: true });
	if (!user) {
		// user with provided email not found
		return {
			ok: false,
			errors: [{ path: 'email', message: 'Wrong email' }],
		};
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		// bad password
		return {
			ok: false,
			errors: [{ path: 'password', message: 'Wrong password' }],
		};
	}

	const refreshTokenSecret = user.password + SECRET2;

	const [token, refreshToken] = await createTokens(
		user,
		SECRET,
		refreshTokenSecret
	);

	console.log(token);
	console.log(refreshToken);

	console.log({ ok: true, token, refreshToken });
	return {
		ok: true,
		token,
		refreshToken,
	};
};
