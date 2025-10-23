import {
  createKindeAPI,
  getEnvironmentVariable,
  invalidateFormField,
  onExistingPasswordProvidedEvent,
  secureFetch,
  WorkflowSettings,
  WorkflowTrigger
} from '@kinde/infrastructure';

export const workflowSettings: WorkflowSettings = {
  id: 'noona-hq-user-migration-debug',
  name: 'Noona HQ User Migration - Debug Version',
  trigger: WorkflowTrigger.ExistingPasswordProvided,
  failurePolicy: {
    action: 'stop'
  },
  bindings: {
    'kinde.widget': {}, // Required for accessing the UI
    'kinde.secureFetch': {}, // Required for secure external API calls
    'kinde.env': {}, // required to access your environment variables
    'kinde.fetch': {}, // Required for management API calls
    'kinde.mfa': {}, // Required for MFA
    url: {} // required for url params
  }
};

type UserDataResponse = {
  name: string;
  email_verified: boolean;
};

// DEBUG VERSION - Simulates migration without external API
export default async function Workflow(event: onExistingPasswordProvidedEvent) {
  const { hashedPassword, providedEmail, password, hasUserRecordInKinde } = event.context.auth;

  console.log("Hitting the drip migration workflow...")

  console.log("User details:")
  console.log(providedEmail)
  console.log(password)

  if (hasUserRecordInKinde) {
    console.log('User exists in Kinde');
    return;
  }

  console.log('User does not exist in Kinde - DEBUG MODE: Using simulated user data');
  
  try {
    // DEBUG: Skip external API validation and use static test data
    console.log('DEBUG: Bypassing external API validation');
    
    // Simulate different test cases by modifying this static data:
    const userData: UserDataResponse = {
      name: "Test User", // Change to test different name formats
      email_verified: true // Change to test verified vs unverified emails
    };

    console.log(`DEBUG: Using simulated user data: ${JSON.stringify(userData)}`);

    if (!userData) {
      // If we were simulating a failed validation
      invalidateFormField('p_password', 'Email or password not found');
      return;
    }

    // Password is "verified" by our simulated data
    // Create the user in Kinde and set the password
    const kindeAPI = await createKindeAPI(event);

    // Create the user in Kinde using simulated data
    console.log(`DEBUG: Creating user in Kinde with simulated data`);
    const nameParts = userData.name.split(' ');
    
    const { data: res } = await kindeAPI.post({
      endpoint: `user`,
      params: {
        profile: {
          given_name: nameParts[0],
          family_name: nameParts[1] || '' // Handle single names
        },
        identities: [
          {
            type: 'email',
            is_verified: !!userData.email_verified,
            details: {
              email: providedEmail
            }
          }
        ]
      }
    });

    const userId = res.id;

    // Set the password for the user in Kinde
    console.log(`DEBUG: Setting password for user with ID ${userId}`);
    const { data: pwdRes } = await kindeAPI.put({
      endpoint: `users/${userId}/password`,
      params: {
        hashed_password: hashedPassword
      }
    });

    console.log('DEBUG: Migration simulation completed:', pwdRes.message);

  } catch (error) {
    console.error('DEBUG: Error in migration simulation:', error);
  }
}