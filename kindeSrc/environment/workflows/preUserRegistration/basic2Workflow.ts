import {
  WorkflowSettings,
  onUserTokenGeneratedEvent,
  WorkflowTrigger,
  accessTokenCustomClaims,
} from "@kinde/infrastructure";


export const workflowSettings: WorkflowSettings = {
  id: "updateToken",
  name: "Add value to token",
  failurePolicy: {
    action: "stop",
  },
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {}, 
    "kinde.auth": {},
    "kinde.mfa": {},
    url: {}
  },
};


function getRandomInt(){
  return Math.floor(Math.random() * 100);
}

export default async function Workflow(event: onUserTokenGeneratedEvent) {
  console.log("Token generation workflow triggered for updating the token");
  
  // 1. The value to be used for the claim
  let randomNum = getRandomInt();
  console.log(`Random number is ${randomNum}`)

  // 2. Define the claim and add it to the token
  const accessToken = accessTokenCustomClaims<{
    user_permissions: number;
  }>();

  accessToken.user_permissions = randomNum;


}