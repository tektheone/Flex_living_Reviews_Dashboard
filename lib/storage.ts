import fs from "fs/promises";
import path from "path";

const SELECTIONS_FILE = path.join(process.cwd(), "data", "review-selections.json");

export interface ReviewSelections {
  selectedReviewIds: number[];
}

export async function getSelectedReviewIds(): Promise<number[]> {
  try {
    const data = await fs.readFile(SELECTIONS_FILE, "utf-8");
    const selections: ReviewSelections = JSON.parse(data);
    return selections.selectedReviewIds || [];
  } catch (error) {
    console.error("Error reading selections file:", error);
    // If file doesn't exist or is corrupted, return empty array
    return [];
  }
}

export async function toggleReviewSelection(reviewId: number): Promise<boolean> {
  try {
    const selectedIds = await getSelectedReviewIds();
    const index = selectedIds.indexOf(reviewId);
    
    let newSelectedIds: number[];
    let isNowSelected: boolean;
    
    if (index > -1) {
      // Remove from selection
      newSelectedIds = selectedIds.filter(id => id !== reviewId);
      isNowSelected = false;
    } else {
      // Add to selection
      newSelectedIds = [...selectedIds, reviewId];
      isNowSelected = true;
    }
    
    const selections: ReviewSelections = {
      selectedReviewIds: newSelectedIds,
    };
    
    await fs.writeFile(SELECTIONS_FILE, JSON.stringify(selections, null, 2));
    return isNowSelected;
  } catch (error) {
    console.error("Error toggling review selection:", error);
    throw error;
  }
}

export async function isReviewSelected(reviewId: number): Promise<boolean> {
  const selectedIds = await getSelectedReviewIds();
  return selectedIds.includes(reviewId);
}

