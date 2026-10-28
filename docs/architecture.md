---

### 6. `docs/architecture.md`
```markdown
# QuickNotes System Architecture

## 1. Requirements

### Functional Requirements
- Users can securely register, authenticate, and manage notes.
- Users can perform full CRUD operations (Create, Read, Update, Delete) on notes.
- Users can organize notes using custom tags.

### Non-Functional Requirements
- **High Availability:** 99.9% uptime.
- **Low Latency:** API read responses under 100ms at the 95th percentile.
- **Scalability:** Capable of supporting 1 million active users globally.

---

## 2. Load Estimates (1 Million Users)
- **Active Users:** Assume 1,000,000 daily active users (DAU).
- **Reads per Second (RPS):** 
  - Average user reads notes 20 times a day = 20,000,000 requests/day.
  - Peak factor (3x average): $60,000,000 / 86,400 \approx 700$ Reads/sec.
- **Writes per Second (WPS):**
  - Average user creates/updates/deletes 2 notes a day = 2,000,000 writes/day.
  - Peak writes: $2,000,000 / 86,400 \approx 23$ Writes/sec.
- **Storage per Year:**
  - 2,000,000 writes/day $\times$ 365 days = 730,000,000 notes/year.
  - Average note size $\approx$ 2 KB.
  - Total text storage: $730,000,000 \times 2\text{ KB} \approx 1.46\text{ TB/year}$ (excluding indices and backups).

---

## 3. Architecture Diagram & Component Explanations