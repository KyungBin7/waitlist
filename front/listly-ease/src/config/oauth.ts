export const oauthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback/google`,
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID",
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/callback/github`,
    scope: "user:email",
  },
};

// Store state values for CSRF protection
const pendingStates = new Set<string>();

export const getGitHubAuthUrl = () => {
  const state = crypto.randomUUID();
  
  // Store state for validation in callback
  pendingStates.add(state);
  
  // Clean up old states after 5 minutes
  setTimeout(() => {
    pendingStates.delete(state);
  }, 5 * 60 * 1000);
  
  const params = new URLSearchParams({
    client_id: oauthConfig.github.clientId,
    redirect_uri: oauthConfig.github.redirectUri,
    scope: oauthConfig.github.scope,
    state,
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

export const validateGitHubState = (state: string): boolean => {
  const isValid = pendingStates.has(state);
  if (isValid) {
    pendingStates.delete(state); // Use state only once
  }
  return isValid;
};

export const getGoogleAuthUrl = (state?: string) => {
  const authState = state || crypto.randomUUID();
  
  // Store state for validation if provided
  if (state) {
    pendingStates.add(authState);
    setTimeout(() => {
      pendingStates.delete(authState);
    }, 5 * 60 * 1000);
  }
  
  const params = new URLSearchParams({
    client_id: oauthConfig.google.clientId,
    redirect_uri: oauthConfig.google.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: authState,
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};