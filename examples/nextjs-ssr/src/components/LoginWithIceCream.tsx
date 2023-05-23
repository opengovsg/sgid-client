"use client";

import { useState } from "react";
import sgidLogo from "@/assets/logo.png";
import singpassLogo from "@/assets/singpass.svg";
import Image from "next/image";
import Link from "next/link";

const flavours = ["Vanilla", "Chocolate", "Strawberry"] as const;
type IceCream = (typeof flavours)[number];

const LoginWithIceCream = () => {
  const [state, setState] = useState<IceCream>("Vanilla");

  return (
    <div className="bg-white rounded-md py-12 px-8 flex flex-col max-w-lg">
      <div className="flex gap-12 w-4/5 mx-auto mb-8">
        <div className="w-full grid place-items-center">
          <Image src={sgidLogo} alt="sgID logo" />
        </div>
        <div className="w-full grid place-items-center">
          <Image src={singpassLogo} alt="Singpass logo" />
        </div>
      </div>
      <h2 className="font-medium mb-1">Favourite ice cream flavour</h2>
      <p className="font-light text-sm mb-2">
        This shows how you can keep state before and after login.
      </p>
      <div className="flex flex-col">
        {flavours.map((flavour) => (
          <div
            key={flavour}
            onClick={() => setState(flavour)}
            className="gap-2 flex cursor-pointer hover:bg-white hover:bg-opacity-10 p-1 rounded-md"
          >
            <input
              type="radio"
              checked={state === flavour}
              value={flavour}
              onChange={(e) => {
                setState(e.target.value as IceCream);
              }}
              title="flavour"
            />
            {flavour}
          </div>
        ))}
      </div>

      <Link prefetch={false} href={`/login?state=${state}`} className="flex">
        <button className="py-2 px-4 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit mx-auto mt-8">
          Login with Singpass app
        </button>
      </Link>
    </div>
  );
};

export default LoginWithIceCream;
