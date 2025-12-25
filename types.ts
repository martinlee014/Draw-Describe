export interface GenerationResult {
  imageUrl: string | null;
  description: string | null;
  timestamp: number;
  prompt: string;
}

export interface LoadingState {
  isGeneratingImage: boolean;
  isGeneratingText: boolean;
}

export enum GenerationError {
  IMAGE_FAILED = 'Failed to generate image',
  TEXT_FAILED = 'Failed to generate description',
  API_KEY_MISSING = 'API Key is missing',
  UNKNOWN = 'An unknown error occurred',
}