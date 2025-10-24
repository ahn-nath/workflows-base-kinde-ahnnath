"use server";

import React from "react";
import {
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeWidget
} from "@kinde/infrastructure";

export default async function Page({request, context}) {
  return (
    <html lang="en">
      <head>
        <title>Test Login</title>
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
      </head>
      <body>
        <div>
          <h1>Custom Login Page</h1>
          {getKindeWidget()}
        </div>
      </body>
    </html>
  );
}