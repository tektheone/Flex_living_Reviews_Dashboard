import fs from "fs/promises";
import path from "path";

const SELECTIONS_FILE = path.join(process.cwd(), "data", "review-selections.json");
const useInMemoryStorage =
  process.env.VERCEL === "1" || process.env.USE_MEMORY_STORAGE === "true";

declare global {
  // eslint-disable-next-line no-var
  var __reviewSelections: number[] | undefined;
}

export interface ReviewSelections {
  selectedReviewIds: number[];
}

async function readSelectionsFromFile(): Promise<number[]> {
  try {
    const data = await fs.readFile(SELECTIONS_FILE, "utf-8");
    const selections: ReviewSelections = JSON.parse(data);
    return selections.selectedReviewIds || [];
  } catch (error) {
    console.error("Error reading selections file:", error);
    return [];
  }
}

async function writeSelectionsToFile(selectedIds: number[]): Promise<void> {
  try {
    const selections: ReviewSelections = {
      selectedReviewIds: selectedIds,
    };
    await fs.writeFile(SELECTIONS_FILE, JSON.stringify(selections, null, 2));
  } catch (error) {
    console.error("Error writing selections file:", error);
  }
}

async function ensureMemoryStore() {
  if (!global.__reviewSelections) {
    global.__reviewSelections = await readSelectionsFromFile();
  }
}

export async function getSelectedReviewIds(): Promise<number[]> {
  if (useInMemoryStorage) {
    await ensureMemoryStore();
    return global.__reviewSelections ?? [];
  }

  return readSelectionsFromFile();
}

export async function toggleReviewSelection(reviewId: number): Promise<boolean> {
  const selectedIds = await getSelectedReviewIds();
  const index = selectedIds.indexOf(reviewId);

  let newSelectedIds: number[];
  let isNowSelected: boolean;

  if (index > -1) {
    newSelectedIds = selectedIds.filter((id) => id !== reviewId);
    isNowSelected = false;
  } else {
    newSelectedIds = [...selectedIds, reviewId];
    isNowSelected = true;
  }

  if (useInMemoryStorage) {
    await ensureMemoryStore();
    global.__reviewSelections = newSelectedIds;
    return isNowSelected;
  }

  await writeSelectionsToFile(newSelectedIds);
  return isNowSelected;
}

export async function isReviewSelected(reviewId: number): Promise<boolean> {
  const selectedIds = await getSelectedReviewIds();
  return selectedIds.includes(reviewId);
}

export {};
