import { subtle } from "node:crypto";

export async function uint8ToSha256(content: Uint8Array): Promise<string> {
  const digest = await subtle.digest("SHA-256", content);
  const hashArray = Array.from(new Uint8Array(digest)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export async function stringToSha256(content: string): Promise<string> {
  return uint8ToSha256(new TextEncoder().encode(content));
}
