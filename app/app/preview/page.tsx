"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

function PreviewImage() {
  const params = useSearchParams();

  return (
    <div className="w-full min-h-[80vh] flex justify-center items-center pt-12 bg-white">
      <Image fill priority src={params.get("imageUrl") ?? "/"} alt="preview" />
      <p></p>
    </div>
  );
}

export default PreviewImage;
