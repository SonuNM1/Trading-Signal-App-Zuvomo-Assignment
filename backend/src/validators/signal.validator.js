
import { z } from 'zod';

const signalSchema = z.object({

  symbol: z
    .string({ required_error: 'symbol is required' })
    .trim()
    .min(1, 'symbol cannot be empty'),

  direction: z.enum(['BUY', 'SELL'], {
    required_error: 'direction is required',
    invalid_type_error: 'direction must be BUY or SELL',
  }),

  entry_price: z
    .number({ required_error: 'entry_price is required', invalid_type_error: 'entry_price must be a number' })
    .positive('entry_price must be positive'),

  stop_loss: z
    .number({ required_error: 'stop_loss is required', invalid_type_error: 'stop_loss must be a number' })
    .positive('stop_loss must be positive'),

  target_price: z
    .number({ required_error: 'target_price is required', invalid_type_error: 'target_price must be a number' })
    .positive('target_price must be positive'),

  entry_time: z
    .string({ required_error: 'entry_time is required' })
    .datetime({ message: 'entry_time must be a valid ISO datetime' }),

  expiry_time: z
    .string({ required_error: 'expiry_time is required' })
    .datetime({ message: 'expiry_time must be a valid ISO datetime' }),

})

.superRefine((data, ctx) => {

  const now = new Date();
  const entryDate = new Date(data.entry_time);
  const expiryDate = new Date(data.expiry_time);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (entryDate < twentyFourHoursAgo) {
    ctx.addIssue({
      path: ['entry_time'],
      code: z.ZodIssueCode.custom,
      message: 'entry_time cannot be more than 24 hours in the past',
    });
  }
  if (expiryDate <= entryDate) {
    ctx.addIssue({
      path: ['expiry_time'],
      code: z.ZodIssueCode.custom,
      message: 'expiry_time must be after entry_time',
    });
  }

  const ep = data.entry_price;
  const sl = data.stop_loss;
  const tp = data.target_price;

  if (data.direction === 'BUY') {

    if (sl >= ep) {
      ctx.addIssue({
        path: ['stop_loss'],
        code: z.ZodIssueCode.custom,
        message: 'For BUY: stop_loss must be less than entry_price',
      });
    }
    if (tp <= ep) {
      ctx.addIssue({
        path: ['target_price'],
        code: z.ZodIssueCode.custom,
        message: 'For BUY: target_price must be greater than entry_price',
      });
    }
  }

  if (data.direction === 'SELL') {

    if (sl <= ep) {
      ctx.addIssue({
        path: ['stop_loss'],
        code: z.ZodIssueCode.custom,
        message: 'For SELL: stop_loss must be greater than entry_price',
      });
    }
    if (tp >= ep) {
      ctx.addIssue({
        path: ['target_price'],
        code: z.ZodIssueCode.custom,
        message: 'For SELL: target_price must be less than entry_price',
      });
    }
  }
});

const validateSignal = (data) => {

  const result = signalSchema.safeParse(data);

  if (result.success) {

    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((err) => err.message);
  return { success: false, errors };
};

export default validateSignal;