import { BASE_URL, clientServer } from '@/config'
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { getConnectionsRequest, getMyConnectionRequests,sendConnectionRequest } from '@/config/redux/action/authAction';



export default function ViewProfilePage({userProfile}) {

  const router=useRouter();
  const postReducer = useSelector((state)=>state.postReducer)
  const dispatch=useDispatch()

  const authState =useSelector((state)=> state.auth)
  
  const [ userPosts,setUserPosts]=useState([])

  const [isCurrentUserInConnection,setIsCurrentUserInConnection] = useState(false)

  const [isConnectionNull,setIsConnectionNull]=useState(true)

  const getUserPost=async()=>{
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({token:localStorage.getItem("token")}))
    await dispatch (getMyConnectionRequests({token:localStorage.getItem("token")}))
  }




   if (!userProfile || !userProfile.userId) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div style={{padding: "2rem"}}>
            <p>Profile not found.</p>
            <button onClick={() => router.back()}>Go Back</button>
          </div>
        </DashboardLayout>
      </UserLayout>
    )
  }





   useEffect(()=>{
  if(!postReducer.posts || !postReducer.postFetched) return; 
  
  let post = postReducer.posts.filter((post)=>{
    return post.userId?.username === router.query.username  
  })
  setUserPosts(post);
},[postReducer.posts, postReducer.postFetched])
   useEffect(()=>{
    if(!authState.connections|| !authState.connectionRequest) return
    console.log(authState.connections,userProfile.userId._id)
    if(authState.connections.some(user=>user.connectionId._id=== userProfile.userId._id)){
      setIsCurrentUserInConnection(true)
      if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted=== true){
        setIsConnectionNull(false)
      }
    }

     if(authState.connectionRequest.some(user=>user.connectionId._id=== userProfile.userId._id)){
      setIsCurrentUserInConnection(true)
      if(authState.connectionRequest.find(user => user.connectionId._id === userProfile.userId._id).status_accepted=== true){
        setIsConnectionNull(false)
      }
    }

   },[authState.connections,authState.connectionRequest])
  
 useEffect(()=>{
  getUserPost()
  
 },[])
 
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            {/* <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" /> */}


            <img
  className={styles.backDrop}
  src={
    userProfile.userId?.profilePicture && userProfile.userId.profilePicture !== "connection.jpg"
      ? `${BASE_URL}/uploads/${userProfile.userId.profilePicture}`
      : `https://ui-avatars.com/api/?name=${userProfile.userId?.name || "User"}&background=random&color=fff`
  }
  alt="backdrop"
/>
          </div>

          <div className={styles.profileContainer__details}>
            <div className={styles.profileContainer__flex}>
              <div style={{flex:"0.8"}}>
                <div style={{display:"flex", width:"fit-content" , alignItems:"center", gap:"1.2rem"}}>
                  <h2>{userProfile.userId.username}</h2>
                  <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:"1.2rem"}}>
                  {isCurrentUserInConnection?
                  <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected"}</button>
                  :
                  <button onClick={async()=>{
                    dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id:userProfile.userId._id}))
                    await dispatch (getConnectionsRequest({token: localStorage.getItem("token")}))
                  }} className={styles.connectBtn}>Connect</button>
                  }
                  <div onClick={ async()=>{
                    const response =await clientServer.get(`/user/download_resume?user_id=${userProfile.userId._id}`)
                    window.open(`${BASE_URL}/uploads/${response.data.message}`,"_blank")
                    
                  }}
                   style={{cursor:"pointer"}}>
                    <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                  </div>
                  
              




                </div>
              </div>
              <div>
              <p>{userProfile.bio}</p>
                  </div>
            </div >

          


          <div style={{flex:"0.2"}}>
            <h3>Recent Activity</h3>
            {userPosts.map((post)=>{
              return(
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card__profileContainer}>
                      {post.media!==""? <img src={`${BASE_URL}/${post.media}`} alt=''/>: <div style={{width:"3.4rem",height:"3.4rem"}}></div>
            }
                    </div>
                    <p>{post.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
         </div>

         <div className="workHistory">
          <h4>Work HIstory</h4>
          <div className={styles.workHistoryContainer}>
            {
              userProfile.pastWork.map((work,index)=>{
                return(
                  <div key={index} className={styles.workHistoryCard}>
                    <p style = {{fontWeight:"bold" ,display: "flex",alignItems:"center",gap:"0.8rem"}}>{work.company} - {work.position}</p>
                    <p>{work.years}</p>
                    </div>
                )
              })
            }
            
          </div>
          </div>        
        </div>

      </DashboardLayout>
    </UserLayout>
  )
}


export async function getServerSideProps(context) {
  const { username } = context.params


  if (!username || username === '0') {
    return { props: { userProfile: null } }
  }
  const token = context.req.cookies?.token
  console.log("token from cookie: ", token)
  console.log("username:", username)
  try {
    const response = await clientServer.get('/user/get_profile_based_on_username', {
      params: { username },
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    console.log("profile response:", response.data)
    return { props: { userProfile: response.data.profile } }
  } catch (error) {
    console.log("getServerSideProps error: ", error.response?.data)
     console.log("error status:", error.response?.status)  
    console.log("error data:", error.response?.data)       
    console.log("error message:", error.message)
    return { props: { userProfile: null } }
  }
}