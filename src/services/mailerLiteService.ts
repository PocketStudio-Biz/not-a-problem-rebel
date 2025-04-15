
/**
 * Service to handle MailerLite API interactions
 * 
 * In a production environment, these requests should be handled by a backend service
 * to keep your API key secure. This is a frontend-only example.
 */

interface SubscribeResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const subscribeToMailerLite = async (
  email: string, 
  name: string
): Promise<SubscribeResponse> => {
  // In a real implementation, this should be a call to your backend API
  // which securely handles the MailerLite API key
  
  try {
    // Replace with your actual MailerLite group ID
    const groupId = "YOUR_GROUP_ID"; 
    
    const response = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": "YOUR_API_KEY", // Replace with your API key
      },
      body: JSON.stringify({
        email,
        name,
        resubscribe: true,
        autoresponders: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.error.message || "Failed to subscribe",
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      message: "Successfully subscribed",
      data,
    };
  } catch (error) {
    console.error("MailerLite subscription error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
