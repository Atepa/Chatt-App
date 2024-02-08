// import { React, useState, useEffect } from "react";
// import {  Navigate, useNavigate  } from "react-router-dom";

// const PrivateRoute =  ({ element: Element, ...props }) => {
//   const [currentUser, setCurrentUser] = useState(undefined);
//   const navigate = useNavigate();

//   useEffect(() => {
//     try{
//         const token = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);

//         if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
//             console.log("token");
//             <Element {...props} />
//         } else {
//             console.log("token");
//             <Navigate to="/login" replace />
//         }
//     }catch( error){
//         console.log(error);
//     }

   
//   }, [currentUser]);

//    currentUser ? console.log("var") : console.log("yok");
//    console.log(currentUser);

// };

// export default PrivateRoute;
