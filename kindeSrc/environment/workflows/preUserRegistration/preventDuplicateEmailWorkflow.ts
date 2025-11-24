import { 
    // createKindeAPI, 
    WorkflowSettings, 
    WorkflowTrigger,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
    id: "onTokenGeneration", // "onPreRegistration",
    name: "LogUserEmail",
    trigger: WorkflowTrigger.UserTokenGeneration,
    failurePolicy: {
        action: "stop"
    },
    bindings: {
        "kinde.env": {}
    }
};

export default async function Workflow2(event: any) {
  console.log("Pre-registration event triggered", event);
}