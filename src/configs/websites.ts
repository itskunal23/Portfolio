import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "Contact & Links",
    sites: [
      {
        id: "my-email",
        title: "Email",
        link: "mailto:k.goenka23@gmail.com"
      },
      {
        id: "my-linkedin",
        title: "LinkedIn",
        link: "https://www.linkedin.com/in/kunalgoenka23/"
      },
      {
        id: "my-github",
        title: "GitHub",
        link: "https://github.com/itskunal23"
      },
      {
        id: "my-resume",
        title: "Résumé",
        link: "/files/kunal-goenka-resume.pdf"
      }
    ]
  },
  freq: {
    title: "References I Build With",
    sites: [
      {
        id: "mcp",
        title: "Model Context Protocol",
        link: "https://modelcontextprotocol.io/"
      },
      {
        id: "langgraph",
        title: "LangGraph",
        link: "https://langchain-ai.github.io/langgraph/"
      },
      {
        id: "fastapi",
        title: "FastAPI",
        link: "https://fastapi.tiangolo.com/"
      },
      {
        id: "chroma",
        title: "ChromaDB",
        link: "https://www.trychroma.com/"
      },
      {
        id: "spacy",
        title: "spaCy",
        link: "https://spacy.io/"
      },
      {
        id: "huggingface",
        title: "Hugging Face",
        link: "https://huggingface.co/"
      },
      {
        id: "arxiv",
        title: "arXiv",
        link: "https://arxiv.org/"
      },
      {
        id: "github",
        title: "GitHub",
        link: "https://github.com/itskunal23"
      }
    ]
  }
};

export default websites;
