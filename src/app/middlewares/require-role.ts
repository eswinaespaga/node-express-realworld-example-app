import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

type AuthPayload = {
  user?: {
    id?: number | string;
  };
};

type RequestWithAuth = Request & {
  auth?: AuthPayload;
};

const requireRole = (requiredRole: string) => {
  return async (
    req: RequestWithAuth,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = Number(req.auth?.user?.id);

      if (!userId || Number.isNaN(userId)) {
        return res.status(401).json({
          errors: {
            authorization: ['authentication required'],
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!user || user.role !== requiredRole) {
        return res.status(403).json({
          errors: {
            authorization: ['insufficient privileges'],
          },
        });
      }

      return next();
    } catch (error) {
      console.error('RBAC middleware error:', error);

      return res.status(500).json({
        errors: {
          authorization: ['error while validating permissions'],
        },
      });
    }
  };
};

export default requireRole;