// import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '../../../lib/prisma';

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { email, secret } = req.body;

//   if (req.method !== 'POST') {
//     return res.status(403).json({ message: 'Method not allowed' });
//   }

//   if (secret !== process.env.AUTH0_HOOK_SECRET) {
//     return res.status(400).json({ message: 'Secret not provided' });
//   }

//   if (email) {
//     await prisma.user.create({
//       data: {
//         email,
//       },
//     });
//     res.status(200).json({ message: 'Successfully created user' });
//   }
// };

// export default handler;
