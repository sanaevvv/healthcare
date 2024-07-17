'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import {GetAppointmentSchema, GetAppointmentType } from "@/lib/validation"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"
import { Dispatch, SetStateAction } from "react"

type Props = {
  userId: string,
  patientId: string | undefined,
  type: 'create' | 'cancel' | 'schedule'
  appointment?: Appointment
  setOpen?: Dispatch<SetStateAction<boolean>>;
}
const AppointmentForm = ({ userId, patientId, type, appointment, setOpen }: Props) => {
  const router = useRouter()
  const form = useForm<GetAppointmentType>({
    resolver: zodResolver(GetAppointmentSchema(type)),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician || '',
      schedule: new Date(appointment?.schedule || Date.now()),
      reason: appointment?.reason || '',
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || ""
    },
  })

  const onSubmit = async (values: GetAppointmentType) => {

    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled'
        break;
      case 'cancel':
        status = 'cancelled'
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason || '',
          note: values.note || '',
          status: status as Status
        }
        const appointment = await createAppointment(appointmentData)

        if (appointment) {
          // form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          )
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        // console.log(updatedAppointment);

        if (updatedAppointment) {
          setOpen && setOpen(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

    let buttonLabel;

    switch (type) {
      case 'cancel':
        buttonLabel = 'Cancel Appointment';
        break;
      case 'schedule':
        buttonLabel = 'Submit Appointment'
        break;
      default:
        buttonLabel = 'Submit Appointment'
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          {type === 'create' &&
            <section className="mb-12 space-y-4">
              <h1 className="header text-white">New Appointment ✋</h1>
              <p className="text-dark-700">Request a new appointment in 10 seconds</p>
            </section>
          }

          {type !== 'cancel' && (
            <>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Doctor"
                placeholder="Select a Doctor"
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

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected Appointment Date"
                showTimeSelect
                dateFormat="MM/dd/yyyy - h:mm aa"
              />
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Reason for Appointment"
                  placeholder="Enter Reason for Appointment"
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="note"
                  label="Notes"
                  placeholder="Enter Notes"
                />
              </div>
            </>
          )}

          {type === "cancel" && (
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="cancellationReason"
              label="Reason for Cancellation"
              placeholder="Enter Reason for Cancellation"
            />
          )}

          <SubmitButton
            isLoading={form.formState.isSubmitting}
            className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
          >
            {buttonLabel}
          </SubmitButton>
        </form>
      </Form>
    )
  }


export default AppointmentForm