'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import {validatePasskeyAction} from '../lib/actions/admin.actions'
import { OtpSchema, OtpSchemaType } from "@/lib/validation"
import { encryptKey } from "@/lib/utils";

export const PasskeyModal = () => {
  const router = useRouter();

  const form = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      passkey: "",
    },
  })

  const onSubmit = async (values: OtpSchemaType) => {
      // const pass= encryptKey(values.passkey)
      const result = await validatePasskeyAction(values.passkey)
      console.log('result', result);

      if (result.success) {
        router.push('/admin')
      } else {
        form.setError("passkey", { message: result.error })
      }
    }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <div className="flex justify-between">
            <AlertDialogTitle>
                Admin Access Verification
            </AlertDialogTitle>
            <AlertDialogCancel asChild>
              <Link href="/">
                <Image src="/assets/icons/close.svg" alt="close" width={20} height={20} />
              </Link>
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="passkey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                     {...field}
                    >
                      <InputOTPGroup className="shad-otp">
                        {Array.from({ length: 6 }, (_, index) => (
                          <InputOTPSlot
                            key={index}
                            className="shad-otp-slot"
                            index={index}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  {form.formState.errors &&  <FormMessage className="text-red-500"/>}

                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogAction
                type="submit"
                className="shad-primary-btn w-full mt-5">
                Enter Admin Passkey
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
