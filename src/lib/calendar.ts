import { google } from 'googleapis';
import yaml from 'js-yaml';

export interface PublicEvent {
  title: string;
  start: string;
  end: string;
  time?: string;
  info?: string;
  description?: string;
  location?: string;
}

interface PublicYaml {
  public?: {
    title?: string;
    time?: string;
    info?: string;
    description?: string;
  };
}

const PUBLIC_MARKER = 'public:';

function parsePublicSection(description: string | null | undefined): PublicYaml['public'] | null {
  if (!description) return null;
  const idx = description.indexOf(PUBLIC_MARKER);
  if (idx === -1) return null;

  try {
    const parsed = yaml.load(description.substring(idx)) as PublicYaml;
    return parsed?.public ?? null;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`[calendar] Failed to parse YAML in event description: ${message}`);
    return null;
  }
}

function buildAuth() {
  const creds = process.env.GOOGLE_CALENDAR_CREDENTIALS;
  if (!creds) return null;

  try {
    const credentials = JSON.parse(creds);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`[calendar] Failed to parse GOOGLE_CALENDAR_CREDENTIALS: ${message}`);
    return null;
  }
}

export async function getUpcomingEvents(): Promise<PublicEvent[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const auth = buildAuth();

  if (!auth || !calendarId) {
    console.warn(
      '[calendar] GOOGLE_CALENDAR_CREDENTIALS or GOOGLE_CALENDAR_ID not set. Returning empty event list.'
    );
    return [];
  }

  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const res = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const items = res.data.items ?? [];
    return items
      .map((event): PublicEvent | null => {
        const publicData = parsePublicSection(event.description);
        if (!publicData?.title) return null;

        const start = event.start?.dateTime ?? event.start?.date;
        const end = event.end?.dateTime ?? event.end?.date;
        if (!start || !end) return null;

        return {
          title: publicData.title,
          time: publicData.time,
          info: publicData.info,
          description: publicData.description,
          location: event.location ?? undefined,
          start,
          end,
        };
      })
      .filter((e): e is PublicEvent => e !== null);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`[calendar] Failed to fetch events: ${message}`);
    return [];
  }
}
