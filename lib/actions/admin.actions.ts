'use server'

import { OtpSchema } from "../validation";
import { decryptKey } from "@/lib/utils";


export async function validatePasskeyAction(passkey: string) {
  // const decryptPass = decryptKey(passkey);
  const result = OtpSchema.safeParse({ passkey })

   if (!result.success) {
    // スキーマ検証に失敗した場合
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Invalid passkey format'
    }
   }

  // スキーマ検証に成功した場合、実際の値の検証を行う
  const isValid = passkey === process.env.ADMIN_PASSKEY
  console.log(isValid);

  if (isValid) {
    // セッションの作成やトークンの発行などを行う
    return { success: true }
  }

  return { success: false, error: 'Invalid passkey' }
}
