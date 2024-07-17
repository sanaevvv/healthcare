'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { PatientFormType, PatientFormValidation} from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, IdentificationTypes, genderOptions, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import FileUploader from "../FileUploader"

const RegisterForm = ({user}:{user:User}) => {
  const router = useRouter()
  const form = useForm<PatientFormType>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: '',
      phone:'',
    },
  })

  const onSubmit = async (values: PatientFormType) => {
    const { identificationDocument: doc } = values;
    const formData = new FormData();

    console.log(doc);


    if (doc && doc.length > 0) {
      const blobFile = new Blob([doc[0]], {
        type: doc[0].type
      })

      formData.append('blobFile', blobFile)
      formData.append('fileName', doc[0].name)
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData
      }

      const patient = await registerPatient(patientData)

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`)
      }
    } catch (error) {
      console.log('error', error);
    }
  }

   return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome ✋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        {/* NAME */}
         <CustomFormField
           fieldType={FormFieldType.INPUT}
           control={form.control}
           name="name"
           label="Full Name"
           placeholder="John Doe"
           iconSrc="/assets/icons/user.svg"
           iconAlt="user"
            />

         {/* EMAIL & PHONE */}
        <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.INPUT}
             control={form.control}
             name="email"
             label="Email"
             placeholder="johndoe@jsmastery.pro"
             iconSrc="/assets/icons/email.svg"
             iconAlt="email"
              />

           <CustomFormField
             fieldType={FormFieldType.PHONE_INPUT}
             control={form.control}
             name="phone"
             label="Phone Number"
             placeholder="(555)-123-4567"
              />
         </div>

        {/* Date of Birth" & Gender */}
         <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.DATE_PICKER}
             control={form.control}
             label="Date of Birth"
             name="birthDate"
              />

           <CustomFormField
             fieldType={FormFieldType.SKELETON}
             control={form.control}
             name="gender"
             label="Gender"
             renderSkeleton={(field) => (
               <FormControl>
                 <RadioGroup
                   className="flex h-11 gap-6 xl:justify-between"
                   onValueChange={field.onChange}
                   defaultValue={field.value}>
                   {genderOptions.map((option) => (
                      <div className="radio-group" key={option}>
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                   ))}
                 </RadioGroup>
               </FormControl>
            )} />
         </div>

        {/* ADDRESS & OCCUPATION */}
         <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.INPUT}
             control={form.control}
             name="address"
             label="Address"
             placeholder="14th Street, New York"
            />

           <CustomFormField
             fieldType={FormFieldType.INPUT}
             control={form.control}
             name="occupation"
             label="Occupation"
             placeholder="Software Engineer"
            />
         </div>

        {/* Emergency Contact */}
         <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.INPUT}
             control={form.control}
             name="emergencyContactName"
             label="Emergency Contact Name"
             placeholder="Guardian's name"
              />

           <CustomFormField
             fieldType={FormFieldType.PHONE_INPUT}
             control={form.control}
             name="emergencyContactNumber"
             label="Emergency Contact Number"
             placeholder="(555) 123-4567"
             />
         </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
         </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a Physician"
         >
           {Doctors.map(doctor => (
             <SelectItem key={doctor.name} value={doctor.name}>
               <div className="flex cursor-pointer items-center gap-2">
                 <Image src={doctor.image}
                   width={32}
                   height={32}
                   alt={doctor.name}
                   className="rounded-full border border-dark-500"
                 />
                 <p className="">{doctor.name}</p>
               </div>
             </SelectItem>
           ))}
         </CustomFormField>

        {/* Insurance Policy */}
         <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.INPUT}
             control={form.control}
             name="insuranceProvider"
             label="Insurance Provider"
             placeholder="BlueCross BlueShield"
              />

           <CustomFormField
             fieldType={FormFieldType.PHONE_INPUT}
             control={form.control}
             name="insurancePolicyNumber"
             label="Insurance Policy Number"
             placeholder="ABC123456789"
             />
         </div>

        {/* Allergies */}
         <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.TEXTAREA}
             control={form.control}
             name="allergies"
             label="Allergies (if any)"
             placeholder="Peanuts, Penicillin, Pollen"
              />

           <CustomFormField
             fieldType={FormFieldType.TEXTAREA}
             control={form.control}
             name="currentMedication"
             label="Current Medication (if any)"
             placeholder="Ibuprofen 200mg, Paracetamol 500mg"
             />
         </div>

        {/* Medical History */}
         <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
             fieldType={FormFieldType.TEXTAREA}
             control={form.control}
             name="familyMedicalHistory"
             label="Family Medical History"
             placeholder="Mother had brain cancer, Father had heart disease"
              />

           <CustomFormField
             fieldType={FormFieldType.TEXTAREA}
             control={form.control}
             name="pastMedicalHistory"
             label="Past Medical History"
             placeholder="Appendectomy and Tonsillectomy"
             />
         </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
         </section>

        {/* Identification */}
         <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an Identification Type"
         >
           {IdentificationTypes.map(type => (
             <SelectItem key={type} value={type}>
               {type}
             </SelectItem>
           ))}
         </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
          />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of Identification Document"
          renderSkeleton={(field) => (
          <FormControl>
            <FileUploader files={field.value} onChange={field.onChange} />
          </FormControl>
          )} />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
         </section>

         <CustomFormField
           fieldType={FormFieldType.CHECKBOX}
           control={form.control}
           name="treatmentConsent"
           label="I consent to treatment"
         />

          <CustomFormField
           fieldType={FormFieldType.CHECKBOX}
           control={form.control}
           name="disclosureConsent"
           label="I consent to disclosure of information"
         />

          <CustomFormField
           fieldType={FormFieldType.CHECKBOX}
           control={form.control}
           name="privacyConsent"
           label="I consent to privacy policy"
         />

        <SubmitButton isLoading={form.formState.isSubmitting}>
          Get Started
        </SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
