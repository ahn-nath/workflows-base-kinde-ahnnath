import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "onPostUserAuthentication",
  trigger: WorkflowTrigger.PostAuthentication,
};

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onPostAuthenticationEvent) {
  console.log("Hello world this is my first line for the workflow `Check IP Against Allowlist Workflow`");
}
