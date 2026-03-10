const BACKEND_URL = "http://localhost:8000";

export async function queryAI(question: string, context?: { columns?: string[]; rows?: number; dataset?: string }) {
  try {
    const body: any = { question };
    if (context) {
      body.context = context;
    }
    const response = await fetch(`${BACKEND_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.status === 429) {
      return {
        error: "Rate limit exceeded. Please wait a moment before asking another question.",
      };
    }
    return await response.json();
  } catch (error) {
    return {
      error:
        "Backend not reachable. Make sure backend is running on port 8000.",
    };
  }
}

export async function uploadDataset(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return {
      error: "Upload failed. Make sure backend is running.",
    };
  }
}

export async function getDatasetSummary() {
  try {
    const response = await fetch(`${BACKEND_URL}/summary`);
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function getAnalyticsData() {
  try {
    const response = await fetch(`${BACKEND_URL}/analysis`);
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
