require('dotenv').config();
import jwt from 'jsonwebtoken';
import { refreshTokens } from './index';
import models from '../models/index';

const SECRET = process.env.JWT_SECRET;
const SECRET2 = process.env.JWT_SECRET2;

export const verifyUser = async (req, res, next) => {
	const token = req.headers['x-token'];
	if (token) {
		try {
			// Check if the token is verified and not expired
			const { user } = jwt.verify(token, SECRET);
			console.log(user.id);
			req.user = user;
		} catch (err) {
			console.log('catch running');
			const refreshToken = req.headers['x-refresh-token'];
			console.log(refreshToken);
			const newTokens = await refreshTokens(
				token,
				refreshToken,
				models,
				SECRET,
				SECRET2
			);

			if (newTokens.token && newTokens.refreshToken) {
				res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
				res.set('x-token', newTokens.token);
				res.set('x-refresh-token', newTokens.refreshToken);
			}
			console.log(newTokens.user);
			req.user = newTokens.user;
		}
	}
	next();
};
