import {
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "onTokenGeneration",
  trigger: WorkflowTrigger.UserTokenGeneration,
};

export default async function Workflow({request, context}) {
  console.log("User token generation triggered");
  console.log("Request data:", JSON.stringify(request, null, 2));
  console.log("Context data:", JSON.stringify(context, null, 2));
}