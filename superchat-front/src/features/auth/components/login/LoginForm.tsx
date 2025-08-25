'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema, LoginFormData} from '../../schemas/loginSchema';
import {useUser} from '../../hooks/useUser';
import {useHookFormMask} from 'use-mask-input';
import {FaEye, FaPhone} from "react-icons/fa6";
import {TbPassword} from "react-icons/tb";
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';
import {motion} from "motion/react";
import Link from "next/link";
import LoginButton from "@/features/auth/components/login/LoginButton";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: {isValid},
  } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const registerWithMask = useHookFormMask(register)

  const {loginUser, isPending} = useUser();

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.phone) setPhoneNumber(value.phone);
      if (error) setError(null);
    });
    return () => subscription.unsubscribe();
  }, [watch, error]);

  const onSubmit = (data: LoginFormData) => {
    loginUser(data).catch(error => {
      if (error.response?.data?.response?.message) {
        setError(error.response.data.response.message);
      } else {
        setError('Erro inesperado');
      }
    });
  };

  return (
    <motion.form layout transition={{layout: {duration: 0.5}}} onSubmit={handleSubmit(onSubmit)}
                 className="space-y-4 w-3/4 shadow-xl py-8 px-4 rounded-lg md:w-2/4 lg:w-1/4">
      <div className='*:not-first:mt-2'>
        <div className='relative'>
          <Input disabled={isPending} readOnly={isPending}
                 className='peer ps-9 md:h-13' {...registerWithMask('phone', "(99) [9]9999-9999", {
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            autoUnmask: true,
            allowMinus: true,
          })} />
          <div
            className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <FaPhone size={16} aria-hidden="true"/>
          </div>
        </div>
      </div>

      <div className='*:not-first:mt-2'>
        <div className='relative'>
          <Input disabled={isPending} readOnly={isPending} className='peer ps-9 pe-9 md:h-13'
                 type={isPasswordVisible ? 'text' : 'password'} {...register('password')} />
          <div
            className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <TbPassword size={16} aria-hidden="true"/>
          </div>
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FaEye size={16} aria-hidden="true"/>
          </button>
        </div>
      </div>

      <div>
        <Link hidden={isPending} href={'/register'} className='text-xs text-gray-400 md:text-sm'>Ou cadastre-se
          agora</Link>
      </div>

      <LoginButton isValid={isValid} isPending={isPending} phoneNumber={phoneNumber} error={error}/>
    </motion.form>
  );
}
