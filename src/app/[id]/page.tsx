import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const urlData = await prisma.url.findUnique({
      where: { shortCode: id },
    });

    if (!urlData) {
      notFound();
    }

    await prisma.url.update({
      where: { id: urlData.id },
      data: { 
        clicks: { increment: 1 },
        lastClickedAt: new Date()
      },
    });

    redirect(urlData.originalUrl);
}
