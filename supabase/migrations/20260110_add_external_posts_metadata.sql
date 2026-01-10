ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_external BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS external_meta JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'posts_external_url_required_when_external'
  ) THEN
    ALTER TABLE posts
      ADD CONSTRAINT posts_external_url_required_when_external
      CHECK (is_external = FALSE OR external_url IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_posts_is_external ON posts(is_external);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'posts_external_url_key'
  ) THEN
    ALTER TABLE posts
      ADD CONSTRAINT posts_external_url_key UNIQUE (external_url);
  END IF;
END $$;
