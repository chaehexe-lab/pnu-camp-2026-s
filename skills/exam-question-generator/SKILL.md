---
name: exam-question-generator
description: Analyze course slides, PDFs, handouts, textbooks, student notes, past exams, and lecture audio or transcripts to infer a professor's emphasized concepts, compare them independently with the student's own important-point list, and generate evidence-based practice exams with answers, explanations, grading criteria, and coverage checks. Use when a student wants professor-aligned predicted questions, a mock exam, a quiz, an importance-point comparison, or feedback on whether they identified the right study priorities.
---

# Exam Question Generator

Create practice questions from traceable instructional evidence. Separate the professor-signal analysis from the student's beliefs so agreement is meaningful rather than self-confirming.

## Workflow

### 1. Establish the exam frame

Identify the subject, exam scope, available sources, preferred language, question types, difficulty, question count, time limit, and whether answers should appear immediately or in a separate section. Infer reasonable defaults when missing and state them briefly.

Treat these as distinct source groups:

- **Professor evidence:** lecture audio/transcripts, slides, handouts, board notes, assignments, review sheets, past exams, and explicit exam hints.
- **Student signals:** the student's importance list, highlights, annotations, summaries, and questions.
- **Background sources:** textbooks or external references not directly emphasized in class.

Never use student signals as evidence of professor emphasis.

### 2. Extract usable evidence

Read all in-scope materials. For audio/video, use an available transcription capability and retain timestamps; if no transcription is possible, request a transcript instead of pretending to have listened. For scans, use OCR when available and flag uncertain text.

Record each candidate concept with its source location: page/slide, section, assignment item, or timestamp. Mark inaccessible or missing files before analysis.

### 3. Infer professor emphasis

Build an evidence table before writing questions. Score each concept using the rubric in [references/emphasis-rubric.md](references/emphasis-rubric.md). Favor repeated explanation, explicit importance language, assessment-like activities, time spent, contrasts, corrections, examples, and links across topics.

Do not equate slide frequency alone with importance. Distinguish:

- explicit emphasis backed by direct language;
- behavioral emphasis inferred from repetition, time, examples, or assignments;
- weak signals that should not drive high-stakes predictions.

Group duplicate labels into one concept while preserving source references. Express confidence as high, medium, or low and explain low-confidence judgments.

### 4. Compare with the student's priorities

Only after completing the professor-evidence analysis, normalize the student's list and compare it concept by concept. Classify each item as:

- **Aligned:** same assessable concept and scope;
- **Partially aligned:** related but too broad, narrow, or missing the professor's key distinction;
- **Student-only:** important to the student but weakly supported by professor evidence;
- **Missed:** supported by professor evidence but absent from the student's list.

Report a transparent weighted coverage score, not a vague percentage:

`coverage = sum(professor emphasis weights covered fully or partially) / sum(all professor emphasis weights)`

Count partial coverage as 0.5 unless the evidence supports another stated value. Treat the score as study guidance, not a prediction of the actual exam.

### 5. Design the practice exam

Read [references/question-design.md](references/question-design.md), then create a blueprint before drafting. Allocate more questions to stronger emphasis signals while maintaining exam-scope coverage. Match known professor patterns from past exams only when evidence exists; otherwise label the format as an assumption.

Generate answerable, unambiguous questions. Each question must map to at least one emphasized concept and source reference. Include a mix of recall, explanation, application, comparison, analysis, or calculation appropriate to the course. Do not invent facts absent from the supplied materials; use background knowledge only when the user permits it and label it.

Keep the answer key separate enough that the student can attempt the exam first. For subjective questions, provide scoring criteria and acceptable answer elements. For multiple choice, explain why the correct option is correct and why distractors fail.

### 6. Verify and present

Check every question for source support, answer correctness, duplicate testing, unintended clues, ambiguity, difficulty, and blueprint coverage. Remove or flag any unsupported item.

Use the output structure in [references/output-format.md](references/output-format.md). If the user asks only for questions, still retain a compact internal evidence check and provide source tags unless they explicitly ask for a clean exam sheet.

## Boundaries

- State that these are practice or predicted questions, never leaked or guaranteed exam items.
- Do not claim to know the professor's intent beyond the supplied evidence.
- Refuse requests to obtain unauthorized exam materials; offer practice questions from legitimate course content instead.
- When evidence is sparse, produce fewer well-supported questions or a provisional set with explicit uncertainty.
