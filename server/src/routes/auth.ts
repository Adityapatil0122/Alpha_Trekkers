import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateTokens,
  verifyRefreshToken,
  generateAccessToken,
} from '../utils/jwt.js';
import { auth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError(409, 'An account with this email already exists');
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      const tokens = generateTokens({ userId: user.id, role: user.role });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { user, ...tokens },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError(401, 'Invalid email or password');
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new AppError(401, 'Invalid email or password');
      }

      const tokens = generateTokens({ userId: user.id, role: user.role });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            role: user.role,
          },
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/refresh-token
router.post(
  '/refresh-token',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError(400, 'Refresh token is required');
      }

      const decoded = verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(401, 'Invalid refresh token');
      }

      const newTokens = generateTokens({ userId: user.id, role: user.role });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newTokens.refreshToken },
      });

      res.json({
        success: true,
        data: newTokens,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });

      // Always return success to avoid email enumeration
      if (!user) {
        res.json({
          success: true,
          message: 'If an account exists with this email, a reset link will be sent',
        });
        return;
      }

      // TODO: Generate a password reset token and send it via email
      // For now, log a placeholder message
      // In production, use nodemailer to send the email with env.SMTP_* config
      // const resetToken = crypto.randomBytes(32).toString('hex');
      // Store hashed token in DB with an expiry timestamp
      // Send email with reset link: `${env.CLIENT_URL}/reset-password?token=${resetToken}`

      console.log(`Password reset requested for ${email}`);

      res.json({
        success: true,
        message: 'If an account exists with this email, a reset link will be sent',
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;

      // TODO: Verify the reset token from DB
      // Find the user with the matching hashed token that hasn't expired
      // For now, return a not-implemented response

      // Placeholder logic:
      // const user = await prisma.user.findFirst({ where: { resetToken: hashedToken, resetTokenExpiry: { gt: new Date() } } });
      // if (!user) throw new AppError(400, 'Invalid or expired reset token');
      // const hashedPassword = await hashPassword(password);
      // await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null } });

      throw new AppError(501, 'Password reset is not yet implemented. Please contact support.');
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/auth/me
router.get(
  '/me',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { bookings: true, reviews: true } },
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
