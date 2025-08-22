import { z } from 'zod';

export const loginSchema = z.object({
	phone: z.string().min(11, ('Telefone é obrigatório')),
	password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
