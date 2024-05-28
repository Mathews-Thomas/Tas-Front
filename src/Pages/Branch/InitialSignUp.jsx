import NavBar from "../../components/common/NavBar"
import SignUp from "../../components/Branch/signup"
const InitialSignUp = () => {
  return (
<div className="flex flex-col flex-nowrap items-center justify-center h-screen bg-white">
      <NavBar signup={true}/>
      <div className="h-full bg-[#F3E9E5] flex justify-center items-center  ">
      <SignUp/>      
      </div>
    </div>

  )
}

export default InitialSignUp
