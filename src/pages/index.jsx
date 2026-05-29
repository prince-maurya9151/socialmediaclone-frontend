import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({subsets: ["latin"]})

import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout/UserLayout";









export default function Home() {
  const router = useRouter()
  return (
   <UserLayout>
   <div className={styles.container}>
    <div className= {styles.mainContainer}>
      <div className={styles. mainContainer__left}>
        <p>Connect with friends without Exaggeration</p>
        <p>A True media plateform, with stories on blufs !</p>
        <div onClick={()=>{
          router.push("/login")
        }} className={styles.buttonJoin}>
          <p>Join now</p>
        </div>

      </div>


      <div className="mainContainer__right">
        <img src="images/images_Connection.jpg" alt="" className="img" />
      </div>
    </div>
   </div>
   </UserLayout>
  );
} 