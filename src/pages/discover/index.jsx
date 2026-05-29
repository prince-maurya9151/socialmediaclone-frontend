
import { getAllPosts } from '@/config/redux/action/postAction'
import { useRouter } from 'next/router'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout/UserLayout'

import React, {  useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from "./index.module.css";

export default function Discoverpage() {
  const authState = useSelector((state)=> state.auth)
  const dispatch = useDispatch()
  useEffect(() => {

    dispatch(getAllUsers());
    // if(!authState.all_profiles_fetched){
    //   dispatch(getAllUsers())

    // }
  },[])
  const router= useRouter()
  console.log("auth state:", authState)
  return (
     <UserLayout>
      <DashboardLayout>
        <div>
          <h1>
            Discover

          </h1>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && authState.allUser?.map((user)=>{
              return(
                <div onClick={()=>{
                  router.push(`/view_profile/${user.userId.username}`)
                }} key={user._id} className={styles.userCard} >

                  {/* <img src={`${BASE_URL}/${user.userId?.profilePicture}`}alt="profile" />  */}
                  <img className={styles.userCard__image} src={
                    `${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="profile" />
                  <div>
                    
                    <h1>{user.userId.username}</h1>
                    <p>{user.userId.name}</p>
                  </div>
                  </div>
              )
})

            }
          </div>
          </div>
      </DashboardLayout>
    </UserLayout>
  )
}



// export default function Discoverpage() {
//   const authState = useSelector((state) => state.auth)
//   const dispatch = useDispatch()
  
//   useEffect(() => {
//     dispatch(getAllUsers())
//   }, [])

//   const router = useRouter()

//   return (
//     <UserLayout>
//       <DashboardLayout>
//         <div>
//           <h1>Discover</h1>
//           <div className={styles.allUserProfile}>
//             {authState.allUser?.length > 0 ? (   // ✅ allUser, not all_users
//               authState.allUser.map((user) => (
//                 <div
//                   onClick={() => router.push(`/view_profile/${user.userId.username}`)}
//                   key={user._id}
//                   className={styles.userCard}
//                 >
//                   <img
//                     className={styles.userCard__image}
//                     src={`${BASE_URL}/${user.userId?.profilePicture}`}
//                     alt="profile"
//                   />
//                   <div>
                    
//                     <hi>{user.userId?.username}</hi>
//                     <p>{user.userId?.name}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>Loading users...</p>
//             )}
//           </div>
//         </div>
//       </DashboardLayout>
//     </UserLayout>
//   )
// }