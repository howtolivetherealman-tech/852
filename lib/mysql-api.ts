/**
 * MySQL API Client for Hostinger backend (`api.php`)
 */

const API_URL = '/api.php';

export async function fetchAllPortalDataFromMySQL() {
  try {
    const res = await fetch(`${API_URL}?action=get_all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.ok) {
      return data;
    }
  } catch (err) {
    console.warn('MySQL API unreachable, falling back to local storage:', err);
  }
  return null;
}

export async function saveReporterToMySQL(reporter: unknown) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_reporter', reporter }),
    });
  } catch (err) {
    console.error('Failed to save reporter to MySQL:', err);
  }
}

export async function saveNewsToMySQL(article: unknown) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_news', article }),
    });
  } catch (err) {
    console.error('Failed to save news to MySQL:', err);
  }
}

export async function deleteNewsFromMySQL(slug: string) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_news', slug }),
    });
  } catch (err) {
    console.error('Failed to delete news from MySQL:', err);
  }
}

export async function updateSettingsInMySQL(settings: unknown) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_settings', settings }),
    });
  } catch (err) {
    console.error('Failed to update settings in MySQL:', err);
  }
}
