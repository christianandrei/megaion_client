import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useUserStore } from "store/userStore";
import http from "services/httpService";

import "assets/css/loader.css";

const AuthWrapper = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const setUser = useUserStore(state => state.setUser);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await http.get("/api/user");
                setUser({
                    id: data.id,
                    name: `${data.lastname}, ${data.firstname}`,
                    type: data.user_type,
                    status: data.status
                });
            } catch (error) {
                if (error.message !== "Request failed with status code 401") {
                    setIsError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getUser();
    }, []);

    if (isLoading) {
        return (
            <div
                className="is-flex is-justify-content-center is-align-items-center"
                style={{ height: "100vh" }}
            >
                <div className="pulse-wrapper">
                    <div className="pulse"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="is-flex is-justify-content-center is-align-items-center"
                style={{ height: "100vh" }}
            >
                Something went wrong!
            </div>
        );
    }

    return <Outlet />;
};

export default AuthWrapper;
