import { NowRequest, NowResponse } from '@vercel/node';
import { connection } from 'mongoose';

import { connectDB } from '../utils/db';
connectDB();

import { User } from '../models';
import { login } from '../utils/auth';

export default async function (req: NowRequest, res: NowResponse) {
  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (!existingUser || !await existingUser.comparePassword(req.body.password)) {
      return res.status(400).send('Incorrect username or password...');
    }

    return await login(existingUser, res, connection);
  } catch (error) {
    connection.close();
    return res.status(502).send(error);
  }
}