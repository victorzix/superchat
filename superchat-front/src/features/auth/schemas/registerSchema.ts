import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string().nonempty('Nome é obrigatório'),
	profilePicture: z.instanceof(File).optional().nullable(),
	phone: z.string().nonempty('Telefone é obrigatório').length(11, ('Quantidade errada de caracteres')),
	password: z.string().nonempty('Senha é obrigatória'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
