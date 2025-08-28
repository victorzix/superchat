'use client';

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AnimatePresence, motion} from "motion/react";
import {Input} from "@/components/ui/input";
import {FaPhone, FaSpinner} from "react-icons/fa6";
import {useHookFormMask} from "use-mask-input";
import {RegisterFormData, registerSchema} from "@/features/auth/schemas/registerSchema";
import {FaUser} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {PiPasswordLight} from "react-icons/pi";
import {useFileUpload} from "@/hooks/use-file-upload";
import {CircleUserRoundIcon, XIcon} from "lucide-react";
import {useUser} from "@/features/auth/hooks/useUser";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {isValidBrazilianMobile} from "@/utils/validatePhone";
import {handleError} from "@/utils/handleError";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    getFieldState,
    formState: {errors, isValid}
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  });
  const [error, setError] = useState<string | null>(null);

  const [{files, isDragging},
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    }] = useFileUpload({
    accept: "image/*"
  })

  const registerWithMask = useHookFormMask(register);
  const {registerUser, isPending} = useUser();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        ...data, ...(files[0]?.file instanceof File && {
          profilePicture: files[0].file,
        })
      })
    } catch (error) {
      setError(handleError(error));
    }
  };

  const nameInput = watch('name');
  const phoneState = getFieldState("phone");
  const canShowPassword = phoneState.isDirty && !phoneState.invalid;
  const previewUrl = files[0]?.preview || null;
  const phoneValue = watch("phone");

  useEffect(() => {
    if (error && phoneValue) {
      setError(null);
    }
  }, [phoneValue]);

  return (
    <motion.form transition={{layout: {duration: 0.5}}} onSubmit={handleSubmit(onSubmit)}
                 className="space-y-4 w-3/4 shadow-xl py-8 px-4 rounded-lg md:w-2/4 lg:w-1/4">

      <div className="flex gap-2">
        <motion.div
          layout
          initial={{flexBasis: "100%"}}
          animate={{flexBasis: nameInput ? "40%" : "100%"}}
          transition={{duration: 0.5, ease: "easeInOut"}}
          className="*:not-first:mt-2"
        >
          <div className="relative">
            <Input
              disabled={isPending}
              readOnly={isPending}
              placeholder='Nome'
              className="text-xs peer ps-9 md:h-13"
              {...register("name")}
            />
            <div
              className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <FaUser aria-hidden='true' size={16}/>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {nameInput && (
            <motion.div
              layout
              initial={{opacity: 0, flexBasis: 0}}
              animate={{opacity: 1, flexBasis: "60%"}}
              exit={{opacity: 0, flexBasis: 0}}
              transition={{duration: 0.5, ease: "easeInOut"}}
              className="*:not-first:mt-2 overflow-hidden"
            >
              <div className="relative">
                <Input
                  disabled={isPending}
                  readOnly={isPending}
                  className="text-xs peer ps-9 md:h-13"
                  {...registerWithMask("phone", "(99) 99999-9999", {
                    placeholder: "",
                    showMaskOnHover: false,
                    showMaskOnFocus: false,
                    autoUnmask: true,
                  })}
                />
                <div
                  className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <FaPhone size={16} aria-hidden="true"/>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        <div className='flex flex-col gap-2'>
          {canShowPassword &&
              <motion.div
                  layout
                  initial={{opacity: 0, height: 0}}
                  animate={{opacity: 1, height: "auto"}}
                  exit={{opacity: 0, height: 0}}
                  transition={{duration: 0.5, ease: "easeInOut"}}
                  className="*:not-first:mt-2 overflow-hidden">
                  <div className='relative'>
                      <Input
                          type='password'
                          disabled={isPending}
                          readOnly={isPending}
                          className="peer ps-9 md:h-13"
                          {...register('password')}
                      />
                      <div
                          className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                          <PiPasswordLight size={16} aria-hidden="true"/>
                      </div>
                  </div>

                  <div className='flex w-full justify-center'>
                      <div className="relative inline-flex">
                          <button
                              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
                              type='button'
                              onClick={openFileDialog}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              data-dragging={isDragging || undefined}
                              aria-label={previewUrl ? "Change image" : "Upload image"}
                          >
                            {previewUrl ? (
                              <img
                                className="size-full object-cover"
                                src={previewUrl}
                                alt={files[0]?.file?.name || "Uploaded image"}
                                width={64}
                                height={64}
                                style={{objectFit: "cover"}}
                              />
                            ) : (
                              <div aria-hidden="true">
                                <CircleUserRoundIcon className="size-4 opacity-60"/>
                              </div>
                            )}
                          </button>
                        {previewUrl && (
                          <Button
                            onClick={() => removeFile(files[0]?.id)}
                            size="icon"
                            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
                            aria-label="Remove image"
                          >
                            <XIcon className="size-3.5"/>
                          </Button>
                        )}
                          <input
                            {...getInputProps()}
                            className="sr-only"
                            aria-label="Upload image file"
                            tabIndex={-1}
                          />
                      </div>
                  </div>
              </motion.div>
          }
        </div>
      </AnimatePresence>
      <Button type='submit'
              disabled={!isValidBrazilianMobile(phoneValue) || isPending || !isValid || !!error}
              className={cn('flex items-center justify-center w-full py-1 rounded-sm text-sm text-secondary enabled:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed enabled:cursor-pointer transition-all duration-700 md:py-3 md:text-lg lg:text-sm enabled:lg:hover:bg-secondary enabled:lg:hover:text-primary enabled:lg:hover:shadow-2xl enabled:lg:hover:scale-105 enabled:lg:hover:font-bold')}>
        {isPending ? <FaSpinner
          className='animate-spin'/> : !isValidBrazilianMobile(phoneValue) ? 'Telefone incorreto' : error ? error : 'Registrar'}
      </Button>
    </motion.form>
  )
}