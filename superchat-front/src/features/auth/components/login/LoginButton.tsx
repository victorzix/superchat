'use client'

import {AnimatePresence, motion} from "motion/react";
import {isValidBrazilianMobile} from "@/utils/validatePhone";
import {FaSpinner} from "react-icons/fa6";

interface LoginButtonProps {
  isValid: boolean,
  isPending: boolean,
  phoneNumber: string,
  error: string | null,
}

export default function LoginButton({isValid, isPending, phoneNumber, error}: LoginButtonProps) {
  return (
    <AnimatePresence>
      {isValid && (
        <motion.div
          key="submit-wrapper"
          layout
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.3}}
        >
          <motion.div
            layout
            className="btn-primary"
            initial={{opacity: 0, y: -30}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -30}}
            transition={{duration: 0.5}}
          >
            <button type='submit'
                    className={`flex items-center justify-center w-full py-1 rounded-sm text-sm text-secondary enabled:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed enabled:cursor-pointer transition-all duration-700 md:py-3 md:text-lg lg:text-sm enabled:lg:hover:bg-secondary enabled:lg:hover:text-primary enabled:lg:hover:shadow-2xl enabled:lg:hover:scale-105 enabled:lg:hover:font-bold`}
                    disabled={!isValidBrazilianMobile(phoneNumber) || isPending || !!error}>
              {isPending ? <FaSpinner
                className='animate-spin'/> : error ? <span className='font-bold shadow-2xl'>{error}</span> : !isValidBrazilianMobile(phoneNumber) ? 'Numero inválido' : 'Entrar'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}