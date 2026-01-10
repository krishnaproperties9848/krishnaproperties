import assert from "node:assert/strict";
import test from "node:test";
import {
  slugify,
  normalizeExternalUrl,
  getCandidateSlug,
  stripHtml,
  parseMetaTag,
  parseCanonical,
  estimateReadingTimeMinutesFromHtml,
} from "./wp-import-utils";

test("slugify should normalize text", () => {
  assert.equal(slugify("Hello World!"), "hello-world");
  assert.equal(slugify("  Multi   Space  "), "multi-space");
  assert.equal(slugify("Áccented Chars"), "ccented-chars");
});

test("normalizeExternalUrl should strip hash and tracking params", () => {
  const url = normalizeExternalUrl("https://example.com/post?utm_source=x#section");
  assert.equal(url, "https://example.com/post");
});

test("getCandidateSlug returns last segment", () => {
  assert.equal(getCandidateSlug("/foo/bar/post-slug"), "post-slug");
  assert.equal(getCandidateSlug("/"), "");
});

test("stripHtml removes tags and scripts/styles", () => {
  const input = '<style>.x{}</style><script>bad()</script><p>Hello <b>World</b></p>';
  assert.equal(stripHtml(input), "Hello World");
});

test("parseMetaTag finds property and name variants", () => {
  const html = '<meta property="og:title" content="Example"><meta name="author" content="Jane">';
  assert.equal(parseMetaTag(html, { attr: "property", value: "og:title" }), "Example");
  assert.equal(parseMetaTag(html, { attr: "name", value: "author" }), "Jane");
});

test("parseCanonical finds link rel=canonical", () => {
  const html = '<link rel="canonical" href="https://example.com/post" />';
  assert.equal(parseCanonical(html), "https://example.com/post");
});

test("estimateReadingTimeMinutesFromHtml estimates ~200 wpm", () => {
  const html = "<p>" + "word ".repeat(400) + "</p>";
  const mins = estimateReadingTimeMinutesFromHtml(html);
  assert.equal(mins, 2);
});
