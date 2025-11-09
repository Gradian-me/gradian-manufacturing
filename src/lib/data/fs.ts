import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "data");

async function readJsonFromDisk<T>(relativePath: string): Promise<T> {
  const absolutePath = path.join(DATA_ROOT, relativePath);
  const fileContents = await fs.readFile(absolutePath, "utf-8");
  return JSON.parse(fileContents) as T;
}

export const readJsonCached = cache(
  async <T,>(relativePath: string): Promise<T> => readJsonFromDisk<T>(relativePath),
);

export async function readJson<T>(relativePath: string): Promise<T> {
  return readJsonFromDisk<T>(relativePath);
}

