import { DiagnosisResult } from "@shared/schema";

export interface MedicalReference {
  textbook: string;
  chapter: string;
  pageRange?: string;
  edition?: string;
}

export interface ICD10Code {
  code: string;
  description: string;
  category: string;
}

export interface VerifiedDiagnosis extends DiagnosisResult {
  icd10Code?: ICD10Code;
  medicalReferences: MedicalReference[];
  evidenceLevel: "A" | "B" | "C" | "Expert Opinion";
  clinicalGuidelines?: string[];
}

// Common ICD-10 codes for frequent medical conditions
export const commonICD10Codes: Record<string, ICD10Code> = {
  // Cardiovascular
  "myocardial infarction": { code: "I21", description: "Acute myocardial infarction", category: "Cardiovascular" },
  "angina": { code: "I20", description: "Angina pectoris", category: "Cardiovascular" },
  "hypertension": { code: "I10", description: "Essential hypertension", category: "Cardiovascular" },
  "heart failure": { code: "I50", description: "Heart failure", category: "Cardiovascular" },
  "atrial fibrillation": { code: "I48", description: "Atrial fibrillation and flutter", category: "Cardiovascular" },
  
  // Respiratory
  "pneumonia": { code: "J18", description: "Pneumonia, unspecified organism", category: "Respiratory" },
  "asthma": { code: "J45", description: "Asthma", category: "Respiratory" },
  "copd": { code: "J44", description: "Chronic obstructive pulmonary disease", category: "Respiratory" },
  "bronchitis": { code: "J40", description: "Bronchitis, not specified as acute or chronic", category: "Respiratory" },
  
  // Gastrointestinal
  "gastritis": { code: "K29", description: "Gastritis and duodenitis", category: "Gastrointestinal" },
  "peptic ulcer": { code: "K27", description: "Peptic ulcer, site unspecified", category: "Gastrointestinal" },
  "gastroenteritis": { code: "K59.1", description: "Gastroenteritis and colitis", category: "Gastrointestinal" },
  "appendicitis": { code: "K37", description: "Unspecified appendicitis", category: "Gastrointestinal" },
  
  // Neurological
  "migraine": { code: "G43", description: "Migraine", category: "Neurological" },
  "tension headache": { code: "G44.2", description: "Tension-type headache", category: "Neurological" },
  "seizure": { code: "G40", description: "Epilepsy", category: "Neurological" },
  "stroke": { code: "I64", description: "Stroke, not specified", category: "Neurological" },
  
  // Endocrine
  "diabetes mellitus": { code: "E11", description: "Type 2 diabetes mellitus", category: "Endocrine" },
  "hyperthyroidism": { code: "E05", description: "Thyrotoxicosis", category: "Endocrine" },
  "hypothyroidism": { code: "E03", description: "Other hypothyroidism", category: "Endocrine" },
  
  // Infectious
  "influenza": { code: "J11", description: "Influenza due to unidentified influenza virus", category: "Infectious" },
  "cellulitis": { code: "L03", description: "Cellulitis and acute lymphangitis", category: "Infectious" },
  "urinary tract infection": { code: "N39.0", description: "Urinary tract infection", category: "Infectious" },
  
  // Musculoskeletal
  "arthritis": { code: "M19", description: "Other and unspecified osteoarthritis", category: "Musculoskeletal" },
  "back pain": { code: "M54.9", description: "Dorsalgia, unspecified", category: "Musculoskeletal" },
  "fibromyalgia": { code: "M79.3", description: "Panniculitis, unspecified", category: "Musculoskeletal" }
};

// Standard medical textbook references
export const medicalTextbooks: Record<string, MedicalReference[]> = {
  // Cardiovascular conditions
  "myocardial infarction": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 295: ST-Elevation Myocardial Infarction", edition: "21st" },
    { textbook: "Braunwald's Heart Disease", chapter: "Chapter 60: STEMI", edition: "12th" }
  ],
  "angina": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 293: Ischemic Heart Disease", edition: "21st" },
    { textbook: "Braunwald's Heart Disease", chapter: "Chapter 59: Stable Ischemic Heart Disease", edition: "12th" }
  ],
  "hypertension": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 298: Hypertensive Vascular Disease", edition: "21st" },
    { textbook: "Park's Textbook of Preventive and Social Medicine", chapter: "Chapter 6: Epidemiology of Chronic Diseases", edition: "25th" }
  ],
  
  // Respiratory conditions
  "pneumonia": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 149: Pneumonia", edition: "21st" },
    { textbook: "Park's Textbook of Preventive and Social Medicine", chapter: "Chapter 4: Epidemiology of Communicable Diseases", edition: "25th" }
  ],
  "asthma": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 281: Asthma", edition: "21st" },
    { textbook: "Park's Textbook of Preventive and Social Medicine", chapter: "Chapter 6: Epidemiology of Chronic Diseases", edition: "25th" }
  ],
  
  // Gastrointestinal conditions
  "gastritis": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 317: Peptic Ulcer Disease", edition: "21st" },
    { textbook: "Sleisenger and Fordtran's Gastrointestinal Disease", chapter: "Chapter 52: Gastritis", edition: "11th" }
  ],
  "peptic ulcer": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 317: Peptic Ulcer Disease", edition: "21st" },
    { textbook: "Sleisenger and Fordtran's Gastrointestinal Disease", chapter: "Chapter 53: Peptic Ulcer Disease", edition: "11th" }
  ],
  
  // Neurological conditions
  "migraine": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 422: Migraine", edition: "21st" },
    { textbook: "Adams and Victor's Neurology", chapter: "Chapter 10: Headache", edition: "12th" }
  ],
  "stroke": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 419: Cerebrovascular Diseases", edition: "21st" },
    { textbook: "Adams and Victor's Neurology", chapter: "Chapter 34: Cerebrovascular Disease", edition: "12th" }
  ],
  
  // Endocrine conditions
  "diabetes mellitus": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 396: Diabetes Mellitus", edition: "21st" },
    { textbook: "Park's Textbook of Preventive and Social Medicine", chapter: "Chapter 6: Epidemiology of Chronic Diseases", edition: "25th" }
  ],
  
  // Infectious diseases
  "influenza": [
    { textbook: "Harrison's Principles of Internal Medicine", chapter: "Chapter 195: Influenza", edition: "21st" },
    { textbook: "Park's Textbook of Preventive and Social Medicine", chapter: "Chapter 4: Epidemiology of Communicable Diseases", edition: "25th" }
  ]
};

export function findICD10Code(condition: string): ICD10Code | undefined {
  const normalizedCondition = condition.toLowerCase();
  
  // Direct match
  if (commonICD10Codes[normalizedCondition]) {
    return commonICD10Codes[normalizedCondition];
  }
  
  // Partial match for complex condition names
  for (const [key, value] of Object.entries(commonICD10Codes)) {
    if (normalizedCondition.includes(key) || key.includes(normalizedCondition)) {
      return value;
    }
  }
  
  return undefined;
}

export function getMedicalReferences(condition: string): MedicalReference[] {
  const normalizedCondition = condition.toLowerCase();
  
  // Direct match
  if (medicalTextbooks[normalizedCondition]) {
    return medicalTextbooks[normalizedCondition];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(medicalTextbooks)) {
    if (normalizedCondition.includes(key) || key.includes(normalizedCondition)) {
      return value;
    }
  }
  
  return [];
}

export function assignEvidenceLevel(condition: string, probability: number): "A" | "B" | "C" | "Expert Opinion" {
  // Evidence levels based on medical standards
  // A = Randomized controlled trials, meta-analyses
  // B = Well-designed clinical studies
  // C = Case series, expert committee reports
  // Expert Opinion = Clinical experience
  
  const highEvidenceConditions = [
    "myocardial infarction", "hypertension", "diabetes mellitus", 
    "pneumonia", "asthma", "stroke", "migraine"
  ];
  
  const moderateEvidenceConditions = [
    "angina", "gastritis", "peptic ulcer", "influenza", "arthritis"
  ];
  
  const normalizedCondition = condition.toLowerCase();
  
  if (probability >= 80 && highEvidenceConditions.some(c => normalizedCondition.includes(c))) {
    return "A";
  } else if (probability >= 60 && moderateEvidenceConditions.some(c => normalizedCondition.includes(c))) {
    return "B";
  } else if (probability >= 40) {
    return "C";
  } else {
    return "Expert Opinion";
  }
}

export function verifyDiagnosis(diagnosis: DiagnosisResult): VerifiedDiagnosis {
  const icd10Code = findICD10Code(diagnosis.condition);
  const medicalReferences = getMedicalReferences(diagnosis.condition);
  const evidenceLevel = assignEvidenceLevel(diagnosis.condition, diagnosis.probability);
  
  // Add clinical guidelines based on condition
  const clinicalGuidelines: string[] = [];
  if (diagnosis.condition.toLowerCase().includes("hypertension")) {
    clinicalGuidelines.push("ACC/AHA Hypertension Guidelines 2017");
  }
  if (diagnosis.condition.toLowerCase().includes("diabetes")) {
    clinicalGuidelines.push("ADA Standards of Medical Care in Diabetes 2024");
  }
  if (diagnosis.condition.toLowerCase().includes("pneumonia")) {
    clinicalGuidelines.push("IDSA/ATS Community-Acquired Pneumonia Guidelines");
  }
  
  return {
    ...diagnosis,
    icd10Code,
    medicalReferences,
    evidenceLevel,
    clinicalGuidelines: clinicalGuidelines.length > 0 ? clinicalGuidelines : undefined
  };
}