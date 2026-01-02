import {
  onUserTokenGeneratedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  accessTokenCustomClaims,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "onUserTokenGeneration",
  name: "Add custom claim to access token",
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {},
  },
};

export default async function (event: onUserTokenGeneratedEvent) {
  console.log(event);
}