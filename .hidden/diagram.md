
graph TB
    A[Terraform Code] --> B[Send Code to LLM Agent via API]
    B --> C[Predict & Save Expected Outcome]
    C --> D[Execute Terraform Plan]
    D --> E[Interpret Output]
    E --> F[Error Found?]
    F -->|Yes| G[Locate Error Source & Query Docs]
    G --> H[Fix Error & Push Commit]
    H --> A
    E --> I[Compare Expected and Interpreted Outcomes]
    F -->|No| I
    I --> J[Execute Terraform Apply]

