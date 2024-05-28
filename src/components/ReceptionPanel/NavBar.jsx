/* eslint-disable react/prop-types */ 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileInfo from "./ProfileInfo";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
const NavBar = ({ handleToggleSidebar, isSidebarOpen }) => {
  return (
    <div
    className={` p-3 text-NavBarText   bg-NavBar w-full relative border-b `}
  >
    <div className="flex w-full items-center ">
      <FontAwesomeIcon
        icon={isSidebarOpen ? faTimes : faBars}
        onClick={handleToggleSidebar}
        className="w-10 hover:scale-[2] scale-150"
      />
      <div className="flex   w-full items-center justify-end xs1:pr-10">
        <div className="pl-5">
          <ProfileInfo   />
        </div>
      </div>
    </div>
  </div>
  );
};

export default NavBar;