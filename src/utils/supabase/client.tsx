import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Create a singleton Supabase client instance
let supabaseClient: any = null;

export function createClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createSupabaseClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          }
        }
      );
    } catch (error) {
      // Client creation failed - will use demo mode
      throw error;
    }
  }
  return supabaseClient;
}

// API helper functions
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-86043ce1`;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Use access token if available, otherwise use anon key
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Silently handle API errors - they will be caught by calling code
    throw error;
  }
}
