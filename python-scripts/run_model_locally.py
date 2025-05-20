import sys
import json
from transformers import pipeline

try:
    # Load the NER model for biomedical entity extraction
    ner = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")
    # Load the zero-shot classification model for severity
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    # Read input text from command-line arguments
    if len(sys.argv) < 2:
        print("Usage: python run_model_locally.py '<input_text>'")
        sys.exit(1)

    input_text = sys.argv[1]

    # Step 1: Extract symptoms/diseases using NER
    try:
        entities = ner(input_text)
        extracted = [e['word'] for e in entities if e.get('entity_group') in ['SYMPTOM', 'DISEASE']]
    except Exception as ner_error:
        extracted = []
        print(f"Warning: NER extraction failed: {ner_error}", file=sys.stderr)

    # Use extracted entities or fallback to input text
    extracted_text = ", ".join(extracted) if extracted else input_text

    # Step 2: Assess severity using zero-shot classification
    candidate_labels = ["mild", "moderate", "severe"]
    try:
        result = classifier(extracted_text, candidate_labels=candidate_labels)
        severity_analysis = [
            {"label": label, "score": float(score)}
            for label, score in zip(result.get("labels", []), result.get("scores", []))
        ]
    except Exception as clf_error:
        severity_analysis = []
        print(f"Warning: Severity classification failed: {clf_error}", file=sys.stderr)

    # Format the result as JSON
    formatted_result = {
        "input_text": input_text,
        "extracted_entities": extracted,
        "analysis": severity_analysis,
    }

    print(json.dumps(formatted_result, indent=2))

except Exception as e:
    print(json.dumps({"error": str(e)}))