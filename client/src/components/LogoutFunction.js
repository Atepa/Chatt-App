import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

const logoutFunction = async () => {

  try {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const token = await JSON.parse(localStorage.getItem("token"));

    const axiosInstance = axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const response = await axiosInstance.get(`${logoutRoute}/${id}`);

    if (response.status === 200) {
      localStorage.clear();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in logoutFunction:", error);
    return false;
  }
};

export default logoutFunction;
