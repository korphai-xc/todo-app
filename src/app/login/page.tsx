import React from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center h-screen ">
      <form className="text-black mx-auto">
        <div className="flex flex-col justify-center text-center text-white text-3xl mb-4">
          <h1>Welcome to Todo app</h1>
        </div>
        <div className="flex justify-between ">
          <label className="text-white" htmlFor="email">
            Email:
          </label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="flex justify-between my-2">
          <label className="text-white" htmlFor="password">
            Password:
          </label>
          <input id="password" name="password" type="password" required />
        </div>
        <div className="flex justify-around">
          <button className="text-white" formAction={login}>
            Log in
          </button>
          <button className="text-white" formAction={signup}>
            Sign up
          </button>
        </div>
        <div className="text-white flex mt-2">
          * Please use your email for sign up <br />
        </div>
      </form>
    </div>
  );
}
