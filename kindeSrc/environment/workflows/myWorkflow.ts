export const workflowSettings = {
    id: "onTokenGeneration",
    trigger: "user:tokens_generation",
    bindings: {
        "kinde.accessToken": {},
        "kinde.idToken": {}
    }
};

export default async function Workflow({request, context}) {
    kinde.accessToken.setCustomClaim("myClaim", "myValue");
    kinde.idToken.setCustomClaim("myClaim", "myValue");
}