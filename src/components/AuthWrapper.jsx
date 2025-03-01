import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Skeleton, Result, Button } from "antd";

import useUserStore from "../store/UserStore";
import useDataStore from "../store/DataStore";

import http from "../services/httpService";

const AuthWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { setUser } = useUserStore();

  useEffect(() => {
    const getData = async () => {
      try {
        //const { data } = await http.get("/api/user");
        const data = {};
        const { user_id, name, roles } = data;
        setUser({
          id: user_id || 1,
          name: name || "Admin",
          roles: data.roles || [],
          type: "Admin",
          // status: data.status
        });
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: 200 }}>
        <Skeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        }
      />
    );
  }

  return <Outlet />;
};

export default AuthWrapper;
