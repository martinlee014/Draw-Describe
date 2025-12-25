/**
 * Mock Service - Replaces AI functionality to avoid API Key requirements.
 * This service simulates the behavior of the AI without making actual API calls.
 */

/**
 * Generates a mock image based on the item name.
 * Returns a stylized placeholder image URL.
 */
export const generateImage = async (item: string): Promise<string> => {
  // Simulate network latency to mimic AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a clean, dark-themed placeholder image
  // Background: gray-800 (#1f2937), Text: indigo-400 (#818cf8)
  const encodedItem = encodeURIComponent(item);
  return `https://placehold.co/1024x1024/1f2937/818cf8/png?text=${encodedItem}&font=montserrat`;
};

/**
 * Generates a mock description based on the item name.
 * Returns a static simulated response.
 */
export const generateDescription = async (item: string): Promise<string> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  return `[Mock Mode Active]\n\nYou requested: "${item}".\n\nSince AI features are currently disabled to remove the API Key requirement, I cannot generate a real-time description. \n\nHowever, this text serves as a placeholder to demonstrate the layout. In the full AI version, this section would contain a detailed, educational explanation of what "${item}" is, including its primary function, history, and interesting facts.`;
};