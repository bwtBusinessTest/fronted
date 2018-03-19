import crypto from 'crypto';

export default function getmd5(password) {
	const md5 = crypto.createHash('md5');
	return md5.update(password).digest('hex');
}