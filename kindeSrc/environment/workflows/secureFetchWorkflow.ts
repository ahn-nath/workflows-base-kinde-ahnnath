import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

// alredy did the binding
export const workflowSettings: WorkflowSettings = {
  id: "postUserAuthentication",
  name: "Post Authentication - Create/Update User in database",
  trigger: WorkflowTrigger.PostAuthentication,
  bindings: {
    "kinde.secureFetch": {},
    "kinde.env": {},
    url: {},
  },
};

export default async function createCustomerUser(event: onPostAuthenticationEvent) {
  console.log(event);

  console.log("This is basic workflow");

}