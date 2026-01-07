import {
  onUserTokenGeneratedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  accessTokenCustomClaims,
  denyAccess,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "onUserTokenGeneration",
  name: "Add custom claim to access token",
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {},
    "kinde.auth": {},

  },
};

export default async function (event: onUserTokenGeneratedEvent) {
  console.log(event);

  denyAccess("You are not allowed to access this resource");

}