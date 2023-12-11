import Image from "next/image";

export default function MainHeader() {
  return (
    <div className="flex md:justify-center justify-around max-w-[100vw] bg-red-800 py-1">
      <div className="text-lg md:text-2xl font-bold md:w-2/5 md:flex flex-col items-end justify-center">
        <p>Tembuku Sakti</p>
        <p>Kabupaten Bangli</p>
      </div>
      <div className="w-1/5 flex justify-center items-center">
        <Image
          className="max-sm:h-12"
          src="/assets/logo.png"
          alt="bangli_icon"
          width={96}
          height={96}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="w-2/5 max-sm:hidden flex flex-col justify-center items-start">
        <p className="font-semibold lg:text-lg">
          Dinas Kependudukan dan Pencatatan Sipil Kabupaten Bangli
        </p>
        <p className="text-sm">
          Jl. Merdeka No.89, Kawan, Kec. Bangli. Kab. Bangli, Bali 80614
        </p>
      </div>
    </div>
  );
}
