import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Nav from "../components/nav";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Web 3 lottery</title>
        <meta name="description" content="Learning web3" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Nav />
    </div>
  );
};

export default Home;
