/**
 * @description Converts a base64 string to plain text (Decode)
 */
export function atob(base64: string): string {
  return Buffer.from(base64, "base64").toString("binary");
}

/**
 * @description Converts a plain text string to base64 string (Encode)
 */
export function btoa(text: string): string {
  return Buffer.from(text, "binary").toString("base64");
}
