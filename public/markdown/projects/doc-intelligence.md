# 📄📊 Defense Document Intelligence Pipeline

*The Boeing Company · Enterprise AI & Data*

The aerospace document-ingestion engine: an asynchronous pipeline that turns thousands of
raw engineering **PDFs** 📄 and legacy **Excel spreadsheets** 📊 into a fast, filterable
retrieval layer.

## Problem

Critical knowledge was locked in thousands of PDFs and legacy engineering documents sitting
in object storage. There was no structured, low-latency way to search across them, and
naive synchronous processing couldn't keep up with the volume.

## Why it mattered

Engineers needed answers from these documents in the flow of work. Slow or unstructured
retrieval put that knowledge out of reach day to day.

## Technical architecture

![Document ingestion pipeline](/img/diagrams/doc-intelligence.svg)

- **AWS S3** holds the source artifacts: aerospace **PDFs** 📄 and legacy **Excel
  spreadsheets** 📊.
- **Asynchronous FastAPI** workers, running in **Docker**, pull artifacts and process them
  concurrently with backpressure and retries so a large backlog drains reliably.
- **Parsing and chunking** is layout-aware and extracts metadata alongside text.
- **Embedding** produces vectors paired with structured metadata fields.
- A **vector index** stores embeddings plus filterable structured fields.
- A read-only **retrieval API** serves filtered semantic search.

## Engineering decisions

- Separated the **write path (ingestion)** from the **read path (retrieval)**. Ingestion
  is allowed to be slow and asynchronous; the query path stays fast and predictable.
- Stored structured metadata next to vectors so queries can be narrowed with filters
  before semantic ranking, which is what keeps tail latency low at scale.
- Containerized workers so ingestion scales horizontally without special infrastructure.

## Evaluation & validation

- Measured retrieval latency at the tail (P95), not just the average, since worst-case
  latency is what users actually feel.

## Measurable impact

- Processed **4,500+ AWS S3 artifacts** into structured vector metadata.
- Achieved **sub-1.2-second P95 retrieval latency**.

## Technology stack

FastAPI (async) · Docker · AWS S3 · PDF / legacy document parsing · vector indexing

**Related:** this is the retrieval layer the **Agentic RAG Platform** queries. Together
they form the read side of the enterprise knowledge system.

> **Note on scope.** Generalized description of production work; the diagram is conceptual
> and contains no internal data, documents, or system details.
