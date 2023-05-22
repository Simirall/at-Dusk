import { Link } from "react-router-dom";

export const Landing = () => {
  return (
    <>
      未ログイントップページです。
      <p>
        <Link to="/login">ログインする</Link>
      </p>
    </>
  );
};
