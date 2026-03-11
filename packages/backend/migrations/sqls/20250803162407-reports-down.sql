DROP MATERIALIZED VIEW IF EXISTS version_install_reports;
DROP MATERIALIZED VIEW IF EXISTS project_install_reports;
DROP MATERIALIZED VIEW IF EXISTS version_launch_reports;
DROP MATERIALIZED VIEW IF EXISTS version_crash_reports;

DROP TABLE IF EXISTS registered_badges_version_reports;

-- Don't bother recreating registered_badges_version_downloads, it was never used