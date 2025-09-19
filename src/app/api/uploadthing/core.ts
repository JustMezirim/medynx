import { createUploadthing, type FileRouter } from "uploadthing/next"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

const f = createUploadthing()

const auth = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    throw new Error("Unauthorized")
  }

  try {
    const payload = await verifyToken(token)
    return { userId: payload.userId, role: payload.role }
  } catch {
    throw new Error("Invalid token")
  }
}

export const ourFileRouter = {
  medicalFileUploader: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "8MB" } })
    .middleware(async () => {
      const user = await auth()
      return { userId: user.userId, role: user.role }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
