import { history } from "~/data/history";
import { versionHref } from "~/lib/resolve-route";

/**
 * The time machine is one widget, public/_tm/time-machine.{js,css}, on every
 * page that shows a version: injected by the proxy into the live portfolio,
 * rendered by the archive route around its frame. This module is what both
 * share, so the two can't drift apart.
 */

export const TM_STYLESHEET = "/_tm/time-machine.css";
export const TM_SCRIPT = "/_tm/time-machine.js";
export const TM_LINK_TEXT = "All versions →";

/**
 * The version list the widget reads, `current` marking the one on screen.
 * history.ts stays the one place versions are declared. Escaping "<" keeps
 * a value from ever closing the script tag early.
 */
export function timeMachineData(currentSlug: string): string {
  return JSON.stringify(
    history.map((version) => ({
      name: version.name,
      date: version.date,
      blurb: version.blurb,
      href: versionHref(version.slug),
      thumb: `/_tm/thumbs/${version.slug}.png`,
      current: version.slug === currentSlug,
    })),
  ).replace(/</g, "\\u003c");
}
