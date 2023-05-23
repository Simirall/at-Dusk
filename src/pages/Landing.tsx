import { Link } from "react-router-dom";

import { clientRoutes } from "@/consts/routes";

export const Landing = () => {
  return (
    <>
      未ログイントップページです。
      <p>
        <Link to={clientRoutes.login}>ログインする</Link>
      </p>
    </>
  );
};
