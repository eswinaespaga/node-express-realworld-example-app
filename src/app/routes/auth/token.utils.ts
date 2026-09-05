import * as jwt from 'jsonwebtoken';

const generateToken = (id: number): string =>
  jwt.sign({ user: { id } }, process.env.JWT_SECRET || 'superSecret', {
    expiresIn: '1h',
  });

export default generateToken;
