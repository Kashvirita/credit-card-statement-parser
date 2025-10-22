# Credit Card Statement PDF Parser

This project is a PDF parser that extracts 5 key data points from credit card statements across 5 major credit card issuers.

## Features

- Parses PDF statements from major issuers (e.g., Chase, Amex, Citi, Capital One, Discover)
- Extracts the following data points:
  1. Statement Date
  2. Account Number (masked)
  3. Total Balance
  4. Minimum Payment Due
  5. Payment Due Date

## Usage

1. Place your PDF statements in the `sample_statements/` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
