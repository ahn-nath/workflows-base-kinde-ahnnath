import {
  WorkflowSettings,
  onUserTokenGeneratedEvent,
  WorkflowTrigger,
} from "@kinde/infrastructure";


export const workflowSettings: WorkflowSettings = {
  id: "updateToken",
  name: "Add value to token",
  failurePolicy: {
    action: "stop",
  },
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.env": {},
    "kinde.auth": {},
    "kinde.mfa": {},
    url: {}
  },
};


function getRandomInt(){
  return Math.floor(Math.random() * 100);
}

export default async function Workflow(event: onUserTokenGeneratedEvent) {
  console.log("Token generation workflow triggered for updating the token", event);
  let randomNum = getRandomInt();

  console.log(`Random number is ${randomNum}`)

}