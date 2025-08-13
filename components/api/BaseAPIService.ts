import APIError from "./APIError";

class BaseAPIService {
  // A variable to prevent multiple simultaneous token refresh requests
  private isRefreshing = false;

  async request(
    url: string,
    method: string,
    params: object = null
  ): Promise<any> {
    const runtimeConfig = useRuntimeConfig();

    // Helper function to build the common configuration
    const getConfig = (token: string | null) => ({
      baseURL: runtimeConfig.public.apiBaseURL,
      method: method,
      headers: {
        Authorization: token ? "Bearer " + token : "",
      },
      body: method !== "GET" ? params : undefined,
      async onRequest({ options }) {
        if (method === "GET") {
          options.params = params;
        }
      },
    });

    // We'll store the original request's parameters to be able to retry it.
    let originalRequestConfig = getConfig(localStorage.getItem("_token"));
    if (method === "GET") {
      originalRequestConfig.params = params;
    }

    try {
      return await $fetch(url, originalRequestConfig);
    } catch (error) {
      const { status, _data } = error.response;

      switch (status) {
        case 401:
          // Check if we are already refreshing the token to avoid infinite loops
          if (this.isRefreshing) {
            // If already refreshing, wait for it to complete and then re-attempt
            // We need a mechanism to wait, but for simplicity, we'll assume the second call will fail and trigger a full logout.
            // A more robust solution would be to use an event bus or a promise queue.
            this.revokeAccess();
            throw new APIError({ message: "Session expired. Please log in again." });
          }

          this.isRefreshing = true;

          try {
            // Attempt to refresh the token
            const newTokens = await this.refreshToken();
            
            // Update the tokens in local storage
            localStorage.setItem("_token", newTokens.accessToken);
            localStorage.setItem("_refreshToken", newTokens.refreshToken);

            // Set the isRefreshing flag back to false
            this.isRefreshing = false;

            // Update the authorization header for the original request
            originalRequestConfig.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            
            // Re-attempt the original request with the new token
            return await $fetch(url, originalRequestConfig);
          } catch (refreshError) {
            // If the refresh token fails for any reason, perform a full logout
            this.isRefreshing = false;
            this.revokeAccess();
            throw new APIError({ message: "Session expired. Please log in again." });
          }
        
        // No change for these errors, as they are not related to authentication
        case 400:
        case 422:
          throw new APIError(_data);
        case 404:
          throw navigateTo("/404");
        
        // For a 500 error, we should NOT log the user out.
        // It's a server issue, not an authentication issue.
        case 500:
          throw new APIError({
            message:
              "A server error occurred. Please try again later. If the problem persists, contact your system administrator.",
          });

        default:
          throw new APIError({
            message:
              "Something went wrong. Please try again. If the problem persists, contact your system administrator",
          });
      }
    }
  }

  // A new method to handle token refreshing
  async refreshToken(): Promise<{ accessToken: string, refreshToken: string }> {
    const runtimeConfig = useRuntimeConfig();
    const refreshToken = localStorage.getItem("_refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await $fetch("/api/refresh-token", { // This URL should match your backend's refresh token endpoint
        baseURL: runtimeConfig.public.apiBaseURL,
        method: "POST",
        body: {
          refreshToken: refreshToken,
        },
      });

      return {
        accessToken: response.accessToken, // Adjust these keys based on your backend's response
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      // If the refresh token request itself fails, we throw an error to trigger the full logout.
      throw new Error("Failed to refresh token.");
    }
  }

  // This method remains for a full, explicit logout
  revokeAccess() {
    localStorage.removeItem("_token");
    localStorage.removeItem("_refreshToken");
    navigateTo("/");
  }
}

export default BaseAPIService;