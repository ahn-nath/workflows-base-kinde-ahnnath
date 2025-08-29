export const workflowSettings = {
    id: "onTokenGeneration",
    trigger: "user:tokens_generation"
};

export default async function Workflow({request, context}) {
    console.log("Test custom workflow ran");
}