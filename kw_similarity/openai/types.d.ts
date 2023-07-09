declare namespace OpenAI {
  export type Role = "user" | "system" | "assistant";
  export interface Message {
    role: Role;
    content: string;
  }
  export interface CompletionRequest {
    model: string;
    messages: Message[];
  }
}
