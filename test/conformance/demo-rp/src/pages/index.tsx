import type { NextPage } from "next";
import Image from "next/image";
import sgidLogo from "../../public/logo.png";
import singpassLogo from "../../public/singpass.svg";
import { useState } from "react";
import Link from "next/link";

const flavours = ["Vanilla", "Chocolate", "Strawberry"] as const;
type IceCream = (typeof flavours)[number];

const Home: NextPage = () => {
  const [state, setState] = useState<IceCream>("Vanilla");

  return (
    <main className="h-screen grid place-items-center">
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
        {/* Selectors to select your ice cream flavour */}
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
                className="cursor-pointer"
                title="flavour"
              />
              {flavour}
            </div>
          ))}
        </div>

        {/* Login with Singpass button */}
        <Link
          prefetch={false}
          href={`/api/auth-url?state=${state}`}
          className="flex"
        >
          <button
            id="login-button"
            className="py-2 px-4 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit mx-auto mt-8"
          >
            Login with Singpass app
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
