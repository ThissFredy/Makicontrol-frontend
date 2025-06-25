import React from "react";

const Page = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <p>Please enter your credentials to log in.</p>
      <form action="/api/login" method="POST">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Page;
