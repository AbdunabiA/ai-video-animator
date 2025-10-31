export enum AnimationType {
  PRODUCT_SHOWCASE = 'Product Showcase',
  LOGO_ANIMATION = 'Logo Animation',
  TEXT_TO_VIDEO = 'Text to Video',
}

export interface VideoGenerationResult {
  videoUrl: string;
}

// FIX: The global declaration for 'window.aistudio' has been removed.
// The TypeScript errors "All declarations of 'aistudio' must have identical modifiers"
// and "Subsequent property declarations must have the same type" indicate that this
// type is already declared in the environment, and this block was a conflicting redeclaration.
