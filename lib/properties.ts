import { Property } from "@/types/review";
import mockProperties from "@/data/mock-properties.json";

export async function getAllProperties(): Promise<Property[]> {
  // In a real application, this might fetch from a database or API
  return mockProperties as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await getAllProperties();
  return properties.find(p => p.id === id) || null;
}

