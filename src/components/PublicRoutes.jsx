import { Outlet, Navigate } from "react-router-dom";

import useUserStore from "../store/UserStore";

const PublicRoutes = () => {
  const { id: userId } = useUserStore((state) => state);

  return !userId ? <Outlet /> : <Navigate replace to="/dashboard" />;
};

export default PublicRoutes;
