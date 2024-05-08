
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from "./prisma"

import { DecodedToken } from '../interface/userInterface';
// dotenv.config();

const SECRET_KEY = 'process.env.JWT_SECRET'



export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h'})
}



  
export const verifyToken = async (token: string): Promise<DecodedToken> => {
try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    // Return the decoded payload
    return decoded;
} catch (error) {
    // Handle token verification errors
    if (error instanceof jwt.JsonWebTokenError) {
    throw new Error('Invalid token');
    } else {
    throw error;
    }
}
};

// isAuthenticated middleware
export const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply): Promise<void>  => {
  try {
    // Get the JWT token from the request headers
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return reply.code(401).send({ error: 'Unauthorized: No token provided' });
    }

    // Verify the JWT token
   await verifyToken(token);

  } catch (error) {
    return reply.code(401).send({ error: 'Unauthorized: Invalid token' });
  }
};

export const getUserId = async (request: FastifyRequest, reply: FastifyReply): Promise<any>  => {
    try {
      // Get the JWT token from the request headers
      const token = request.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return reply.code(401).send({ error: 'Unauthorized: No token provided' });
      }
  
      // Verify the JWT token
     const verify = await verifyToken(token);
     return verify
     
    } catch (error) {
      return reply.code(401).send({ error: 'Unauthorized: Invalid token' });
    }
  };


// isBuyer middleware
export const isBuyer = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {

    // Get the JWT token from the request headers
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return reply.code(401).send({ error: 'Unauthorized: No token provided' });
    }

    // Verify the JWT token
    const decoded = await verifyToken(token) as DecodedToken;
    const id = decoded.id; 

    const buyer = await prisma.user.findUnique({
        where: {
        id,
        },
        include: {
            role: true,
        },
    });

  if (buyer?.role.name !== 'buyer') {
    return reply.code(403).send({ error: 'Forbidden: User is not a buyer' });
  }

  return
};


export const isSeller = async (request: FastifyRequest, reply: FastifyReply) => {

    // Get the JWT token from the request headers
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return reply.code(401).send({ error: 'Unauthorized: No token provided' });
    }

    // Verify the JWT token
    const decoded = await verifyToken(token) as DecodedToken;
    const id = decoded.id; 

    const seller = await prisma.user.findUnique({
        where: {
        id,
        },
        include: {
            role: true,
        },
    });


  if (seller?.role.name !== 'seller') {
    return reply.code(403).send({ error: 'Forbidden: User is not a seller' });
  }
};

// Register the middleware
// const authMiddleware = async (fastify: FastifyInstance) => {
//   fastify.addHook('preHandler', isBuyer, {
//     name: 'isBuyer',
//   });

//   fastify.addHook('preHandler', isSeller, {
//     name: 'isSeller',
//   });
// };

// export default authMiddleware;