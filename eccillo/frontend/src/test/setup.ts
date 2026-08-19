import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Without `globals: true` testing-library never registers its own auto-cleanup,
// so each test would inherit the previous one's DOM and query it by accident.
afterEach(cleanup);
