'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { UserFormType, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType{
  INPUT = "input",
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = "datePicker",
  SELECT = 'select',
  SKELETON='skeleton'
}

const PatientForm = () => {
  const router = useRouter()
  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: '',
      phone:'',
    },
  })

  const onSubmit = async(formData: UserFormType) => {
    try {
      const newUser = await createUser(formData)

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`)
      }
    } catch (error) {
      console.log('error', error);
    }
  }

   return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
         <section className="mb-12 space-y-4">
           <h1 className="header text-white">Hi there ✋</h1>
           <p className="text-dark-700">Schedule your first appointment</p>
         </section>

         <CustomFormField fieldType={FormFieldType.INPUT} name="name" label="Full Name" placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="user" control={form.control} />

         <CustomFormField fieldType={FormFieldType.INPUT} name="email" label="Email" placeholder="johndoe@jsmastery.pro" iconSrc="/assets/icons/email.svg" iconAlt="email" control={form.control} />

         <CustomFormField fieldType={FormFieldType.PHONE_INPUT} name="phone" label="Phone Number" placeholder="xxx-xxxx-xxxx" control={form.control}/>

         <SubmitButton isLoading={form.formState.isSubmitting}>
           Get Started
         </SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
