import { 
    createKindeAPI, 
    WorkflowSettings, 
    WorkflowTrigger,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
    id: "onPreRegistration",
    name: "LogUserEmail",
    trigger: WorkflowTrigger.UserPreRegistration,
    failurePolicy: {
        action: "stop"
    },
    bindings: {
        "kinde.env": {}
    }
};

export default async function Workflow(event: any) {
  console.log("Pre-registration event triggered", event);
  
  if (event.context.user?.email) {
    console.log(`New user attempting to register: ${event.context.user.email}`);
  }
}