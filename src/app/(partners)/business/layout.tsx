import React from "react";
import PartnerSidebar from "@/components/partners/PartnerSidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FBFAFF]">
      {/* Sidebar for Desktop */}
      <PartnerSidebar />

      {/* Main Content */}
      <main className="flex-1 xl:ml-80 p-6 xl:p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Background blobs for premium look */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-fowy-blue/5 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fowy-purple/5 blur-[120px] rounded-full -z-10" />
    </div>
  );
}
