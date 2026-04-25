import ical from 'node-ical';
import type { VEvent } from 'node-ical';
import { getCollection } from 'astro:content';

export interface PublicEvent {
  title: string;
  start: string;
  end: string;
  description?: string;
  descriptionIsHtml?: boolean;
  location?: string;
  projectSlug?: string;
}

function isHtml(text: string): boolean {
  return /<[a-z][\s\S]*?>/i.test(text);
}

/**
 * Returns upcoming occurrences of an event. For non-recurring events this is
 * either zero or one entry; for recurring events it's up to RECURRING_MAX
 * future occurrences within the next year.
 */
function getOccurrences(event: VEvent, now: Date): { start: Date; end: Date }[] {
  const baseStart = new Date(event.start);
  const baseEnd = new Date(event.end ?? event.start);
  const duration = baseEnd.getTime() - baseStart.getTime();

  if (!event.rrule) {
    if (baseStart < now) return [];
    return [{ start: baseStart, end: baseEnd }];
  }

  // rrule.between() needs us to query in the wall-clock-as-UTC frame it operates in.
  // Then we adjust each result back to the real UTC moment in the event's timezone.
  const tz = (event.start as Date & { tz?: string }).tz || DEFAULT_TZ;
  const queryNow = new Date(now.getTime() + tzOffsetMs(now, tz));
  const horizon = new Date(queryNow.getTime() + HORIZON_MS);
  const rawDates = event.rrule.between(queryNow, horizon, true);

  // Filter out cancelled occurrences listed in EXDATE (compared in raw frame).
  const exdateTimes = new Set<number>();
  if (event.exdate) {
    for (const exd of Object.values(event.exdate)) {
      exdateTimes.add(new Date(exd as string | Date).getTime());
    }
  }

  return rawDates
    .filter((d) => !exdateTimes.has(d.getTime()))
    .slice(0, RECURRING_MAX)
    .map((rawStart) => {
      const start = adjustRRuleOccurrence(rawStart, tz);
      return { start, end: new Date(start.getTime() + duration) };
    })
    .filter(({ start }) => start >= now);
}

/**
 * If the last line of the description matches a known project slug, strip it
 * and return it separately. Handles both plain text (last line after a
 * newline) and HTML descriptions (last segment after a <br> or </p>). If the
 * trailing token doesn't match a real project, leave the description untouched
 * so we don't accidentally swallow a regular line of text.
 */
function extractProjectSlug(
  description: string,
  validSlugs: Set<string>
): { description: string; slug?: string } {
  // Normalize to plain-text lines: convert HTML line breaks to newlines, strip
  // remaining tags. This is only used for slug detection — the original
  // description (HTML or plain) is what we keep for rendering.
  const normalized = description
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ');

  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) return { description: description.trim() };

  const last = lines[lines.length - 1];
  if (!validSlugs.has(last)) return { description: description.trim() };

  // Strip the trailing slug from the original description, including any
  // immediately preceding <br>, </p>, or whitespace.
  const trailingSlugPattern = new RegExp(
    `(?:<br\\s*/?>|</p\\s*>|\\s)*\\s*${last}\\s*(?:</p\\s*>)?\\s*$`,
    'i'
  );
  const cleaned = description.replace(trailingSlugPattern, '').trimEnd();

  return { description: cleaned, slug: last };
}

// Public iCal feed for the "Will Wheeler — Gigs" calendar.
// This is a deliberately public calendar; only events safe for public consumption
// should be added to it.
const ICAL_URL =
  'https://calendar.google.com/calendar/ical/904ea4233f384e6202a9817c4a9a47bb5faca3fc1391d0361f0d6d1e57bcf242%40group.calendar.google.com/public/basic.ics';

const RECURRING_MAX = 4;
const HORIZON_MS = 365 * 24 * 60 * 60 * 1000; // one year

// Default timezone for events lacking an explicit TZID (most of Will's gigs are
// in the Bay Area). Used both for rrule occurrence adjustment and for display
// fallback.
const DEFAULT_TZ = 'America/Los_Angeles';

/**
 * Returns the offset of `tz` from UTC at the given moment, in milliseconds.
 * Negative for timezones behind UTC (e.g. -25200000 for PDT).
 */
function tzOffsetMs(at: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(dtf.formatToParts(at).map((p) => [p.type, p.value]));
  const hour = parts.hour === '24' ? 0 : Number(parts.hour);
  const wallTimeAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second)
  );
  return wallTimeAsUtc - at.getTime();
}

/**
 * rrule.js doesn't honor TZID — it treats DTSTART's wall-clock time as UTC.
 * For a recurring event in `tz`, an rrule occurrence comes back with the
 * intended wall-clock components but the wrong UTC moment. This converts it
 * to the actual UTC moment when that wall-clock time happens in `tz`.
 */
function adjustRRuleOccurrence(rruleDate: Date, tz: string): Date {
  return new Date(rruleDate.getTime() - tzOffsetMs(rruleDate, tz));
}

export async function getUpcomingEvents(): Promise<PublicEvent[]> {
  try {
    const projects = await getCollection('projects');
    const validSlugs = new Set(projects.map((p) => p.slug));

    const data = await ical.async.fromURL(ICAL_URL);
    const now = new Date();

    const events: PublicEvent[] = [];

    for (const item of Object.values(data)) {
      if (item.type !== 'VEVENT') continue;
      const event = item as VEvent;
      if (!event.start) continue;

      let description: string | undefined = event.description ?? undefined;
      let projectSlug: string | undefined;
      let descriptionIsHtml = false;
      if (description) {
        const parsed = extractProjectSlug(description, validSlugs);
        description = parsed.description || undefined;
        projectSlug = parsed.slug;
        descriptionIsHtml = description ? isHtml(description) : false;
      }

      for (const occ of getOccurrences(event, now)) {
        events.push({
          title: event.summary ?? 'Untitled event',
          description,
          descriptionIsHtml,
          location: event.location ?? undefined,
          start: occ.start.toISOString(),
          end: occ.end.toISOString(),
          projectSlug,
        });
      }
    }

    return events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`[calendar] Failed to fetch events: ${message}`);
    return [];
  }
}
