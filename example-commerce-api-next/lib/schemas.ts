import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.number().int(),
  color: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const updateItemSchema = z.object({ quantity: z.number().int().min(0).max(20) });

export const promoSchema = z.object({ code: z.string().min(1) });

export const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().nullish(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().regex(/^[A-Z]{2}$/),
  phone: z.string().nullish(),
});

export const createOrderSchema = z.object({
  cartId: z.string().min(1),
  email: z.email(),
  shippingAddress: addressSchema,
  shippingMethod: z.enum(['standard', 'express']).nullish(),
  payment: z.object({
    cardNumber: z.string().regex(/^[0-9 ]{12,23}$/),
    expMonth: z.number().int().min(1).max(12),
    expYear: z.number().int().min(2000).max(2100),
    cvc: z.string().regex(/^[0-9]{3,4}$/),
    nameOnCard: z.string().min(1),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
