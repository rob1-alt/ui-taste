// llms.txt: what the site is and where things are, in Markdown, for answer engines and agents.
import { getLibrary, libraryCounts } from "@/lib/library";
import { BASE_URL } from "@/lib/meta";
import { FAQ } from "@/lib/faq";
import { patternMetas, typeMetas } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const lib = getLibrary(), c = libraryCounts(lib);
  const types = typeMetas(lib).map((t) => `- [${t.name} examples](${BASE_URL}/examples/${t.slug}): ${lib.filter((x) => x.type === t.type).length} ${t.plural}, measured`).join("\n");
  const pats = patternMetas(lib).slice(0, 40).map((p) => `- [${p.name}](${BASE_URL}/patterns/${p.tag}): ${p.count} pages`).join("\n");
  const body = `# ui taste

> An open-source skill that shows AI coding agents (Claude Code, Codex, Cursor and any agent that reads SKILL.md) what good interfaces look like: a library of ${c.pages} real web pages from ${c.sites} products known for their design, measured on the live page, a search to find the right reference, and a review against the habits that make an interface look generated.

Install in Claude Code: \`/plugin marketplace add rob1-alt/ui-taste\` then \`/plugin install ui-taste@ui-taste\`. For other agents: \`npx skills add rob1-alt/ui-taste\`. Source: https://github.com/rob1-alt/ui-taste

## Pages
- [Home](${BASE_URL}/): what the skill does, a live search, a before/after (same prompt, same model), the 16 landing directions, the numbers, the anti-slop review
- [Library](${BASE_URL}/library): every page, filterable by type and pattern, each with its measured fonts, type scale, colours and buttons
- [Examples](${BASE_URL}/examples): the library by page type and by pattern
- [Full text for LLMs](${BASE_URL}/llms-full.txt): every page in the library with its note

## Examples by page type
${types}

## Examples by pattern
${pats}

## FAQ
${FAQ.map(([q, a]) => `### ${q}\n${a}`).join("\n\n")}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
