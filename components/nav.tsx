import Link from "next/link";
import { FC, useEffect } from "react";
import { useMoralis } from "react-moralis";

const Nav: FC = () => {
  const { enableWeb3, account, isWeb3Enabled, deactivateWeb3 } = useMoralis();

  const connectMeta = async () => {
    await enableWeb3();
  };

  useEffect(() => {
    if (isWeb3Enabled) return;
    connectMeta();
  }, []);

  const SITE_NAME = "Web3 Lottery";
  const navComponent = account ? (
    <nav className="flex justify-between p-4 bg-menu-bar">
      <Link href="/">
        <a className="text-text text-2xl font-bold">{SITE_NAME}</a>
      </Link>
      <menu className="flex">
        <p className="ml-4 text-text text-lg font-bold">
          {account.slice(0, 10)}..{account.slice(account.length - 4)}{" "}
        </p>
        <Link href="/">
          <a
            href=""
            className="ml-4 text-text text-lg font-bold"
            onClick={deactivateWeb3}
          >
            Disconnect Metamask
          </a>
        </Link>
      </menu>
    </nav>
  ) : (
    <nav className="flex justify-between p-4  bg-menu-bar">
      <Link href="/about">
        <a className="text-text text-2xl font-bold">{SITE_NAME}</a>
      </Link>

      <Link href="/">
        <a className="ml-4 text-text text-lg font-bold" onClick={connectMeta}>
          Connect to Metamask
        </a>
      </Link>
    </nav>
  );
  return navComponent;

  //   return (
  //     <>
  //       {account ? (
  //         <>
  //           <p>
  //             Connected to {account.slice(0, 10)}..
  //             {account.slice(account.length - 4)}
  //           </p>
  //           <button onClick={deactivateWeb3}>Disconnect</button>
  //         </>
  //       ) : (
  //         <button onClick={connectMeta}>Connect to MetaMask</button>
  //       )}
  //     </>
  //   );
};

export default Nav;
