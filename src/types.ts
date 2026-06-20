export type AIProvider = "gemini" | "openai";

export interface ScriptBlock {
  id: string;
  name: string;
  code: string;
  posX?: number;
  posY?: number;
}
