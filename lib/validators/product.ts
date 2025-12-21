import {z} from 'zod';
export const productSchema=z.object(
    {
        name:z.string()
        .min(2,"Product name must be at least 2 characters"),
        price:z.number()
        .positive("Price must be greater than 0"),
        stock:z.number()
        .int("Stock must be an integer")
        .nonnegative("Stock cannot be negative"),
        category:z.string()
        .min(2,"Category must be at least 2 characters")
    }
);
export type Product= z.infer<typeof productSchema>;