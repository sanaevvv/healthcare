"use client"

import { ColumnDef } from "@tanstack/react-table"
import { StatusBadge } from "../StatusBadge"
import { Appointment } from "@/types/appwrite.types"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import { AppointmentModal } from "../AppointmentModal"

// 列の定義
export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    // セルの内容をどのようにレンダリングするか
    cell: ({ row }) =>
      <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: 'patient',
    header: 'Patient',
    cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
  },
  {
  // データオブジェクトのどのフィールドをこの列に表示するかを指定
    accessorKey: "status",
  // 列のヘッダーとして表示されるテキスト
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        {/* row.original:元のデータオブジェクトを参照 */}
        <StatusBadge status={row.original.status} />
      </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => <p className="text-14-text-14-regular min-w-[100px]">
      {formatDateTime(row.original.schedule).dateTime}
    </p>
  },
  {
    accessorKey: "primaryPhysician",
    header: 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find((doc) => (
        doc.name === row.original.primaryPhysician))

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image || ''}
            alt={doctor?.name || 'doctor'}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">
            Dr. {doctor?.name}
          </p>
      </div>
      )
    },
  },
  {
    // 通常のデータフィールドを表示する列とは異なる動作をする列を定義する際 id を使用して識別
    // 特定のデータフィールドに紐付いていないためです。
    id: "actions",
    header: () => <p className="pl-4">Actions</p>,
    cell: ({ row }) => {
      const data=row.original
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
          />
          <AppointmentModal
            type="cancel"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
          />
        </div>
      )
    },
  },
]
