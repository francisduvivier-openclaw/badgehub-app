DROP TABLE IF EXISTS registered_badges_version_downloads;

---

-- Step 2: Create the new table for version reports with individual counters.
CREATE TABLE registered_badges_version_reports
(
    id                  SERIAL PRIMARY KEY,
    registered_badge_id TEXT                                   NOT NULL,
    version_id          INTEGER                                NOT NULL,
    install_count       BIGINT                   DEFAULT 0     NOT NULL,
    launch_count        BIGINT                   DEFAULT 0     NOT NULL,
    crash_count         BIGINT                   DEFAULT 0     NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_registered_badge
        FOREIGN KEY (registered_badge_id) REFERENCES registered_badges (id) ON DELETE CASCADE,
    CONSTRAINT fk_version
        FOREIGN KEY (version_id) REFERENCES versions (id) ON DELETE CASCADE,
    CONSTRAINT registered_badges_version_reports_unique UNIQUE (registered_badge_id, version_id)
);

-- Add indexes for better query performance on foreign keys.
CREATE INDEX idx_rbvr_registered_badge_id ON registered_badges_version_reports (registered_badge_id);
CREATE INDEX idx_rbvr_version_id ON registered_badges_version_reports (version_id);

---

-- Step 3: Create MATERIALIZED VIEW for install reports.
CREATE MATERIALIZED VIEW version_install_reports AS
SELECT
    v.id AS version_id,
    v.project_slug,
    v.revision,
    COUNT(DISTINCT r.registered_badge_id) AS distinct_installs
FROM
    versions v
        JOIN
    registered_badges_version_reports r ON v.id = r.version_id
WHERE
    r.install_count > 0
GROUP BY
    v.id, v.project_slug, v.revision;

-- Create a unique index for fast lookups and refreshing.
CREATE UNIQUE INDEX idx_version_install_reports_version_id ON version_install_reports (version_id);


-- Step 3: Create MATERIALIZED VIEW for install reports distict for a project for a distinct badge.
CREATE MATERIALIZED VIEW project_install_reports AS
SELECT
    v.project_slug,
    COUNT(DISTINCT r.registered_badge_id) AS distinct_installs
FROM
    versions v
        JOIN
    registered_badges_version_reports r ON v.id = r.version_id
WHERE
    r.install_count > 0
GROUP BY
    v.project_slug;

-- Create a unique index for fast lookups and refreshing.
CREATE UNIQUE INDEX idx_project_install_reports_version_id ON project_install_reports (project_slug);

---

-- Step 4: Create MATERIALIZED VIEW for launch reports.
CREATE MATERIALIZED VIEW version_launch_reports AS
SELECT
    v.id AS version_id,
    v.project_slug,
    v.revision,
    COUNT(DISTINCT r.registered_badge_id) AS distinct_launches
FROM
    versions v
        JOIN
    registered_badges_version_reports r ON v.id = r.version_id
WHERE
    r.launch_count > 0
GROUP BY
    v.id, v.project_slug, v.revision;

-- Create a unique index for fast lookups and refreshing.
CREATE UNIQUE INDEX idx_version_launch_reports_version_id ON version_launch_reports (version_id);

---

-- Step 5: Create MATERIALIZED VIEW for crash reports.
CREATE MATERIALIZED VIEW version_crash_reports AS
SELECT
    v.id AS version_id,
    v.project_slug,
    v.revision,
    COUNT(DISTINCT r.registered_badge_id) AS distinct_crashes
FROM
    versions v
        JOIN
    registered_badges_version_reports r ON v.id = r.version_id
WHERE
    r.crash_count > 0
GROUP BY
    v.id, v.project_slug, v.revision;

-- Create a unique index for fast lookups and refreshing.
CREATE UNIQUE INDEX idx_version_crash_reports_version_id ON version_crash_reports (version_id);

