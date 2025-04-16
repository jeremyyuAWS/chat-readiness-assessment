# 🧠 Lyzr AI Readiness Chat Agent

A modular, chat-based onboarding experience that guides users through their AI journey and generates qualified leads by offering personalized recommendations and content. Built with **Bolt.new** on the front end, **Lyzr Studio** for agent logic, and simulated data to support interactive demo workflows.

---

## 🎯 Purpose

This app replaces the static [AI Readiness Assessment](https://ai-readiness-assessment.lyzr.ai/) with an intelligent, dynamic chatbot that:
- Engages users in natural conversation about their AI maturity, goals, and use cases.
- Provides tailored recommendations (tutorials, demo apps, blog posts, etc.).
- Collects and qualifies leads based on user responses.
- Demonstrates the power of Lyzr’s platform to create custom onboarding agents.

---

## ✨ Key Features

### ✅ Core Chat Experience
- Conversational flow driven by an AI agent built in Lyzr Studio
- Clean, fast UI with typing animations and branded avatar
- Guided experience with branching logic based on role, AI maturity, and interests
- Simulated responses and data for demo purposes (no backend required)

### 📥 Lead Generation Capabilities
- **Progressive Profiling**: Gathers user data (role, maturity, interest) during conversation
- **Smart Lead Capture Prompt**: After recommendations are shown, user is asked if they want to receive their AI Starter Kit via email
- **Downloadable Starter Kit PDF** (optional email gate): Personalized based on answers
- **CRM & Marketing Integration Ready**:
  - Formatted data for HubSpot, Salesforce, or custom webhook
  - Optional integration points for Segment or PostHog
- **Lead Scoring Model** (simulated for demo): Users scored based on behavior and responses
- **Sales Handoff Agent**: Final prompt offers to book a call or chat with a Solutions Architect (Calendly or other)

### 🧩 Modular Component Architecture
Each module is built independently to allow rapid prototyping and reusability:

| Component | Description |
|-----------|-------------|
| `ChatLauncher` | Button/modal to trigger chat window |
| `ChatInterface` | UI for all chatbot interactions |
| `AgentSimulator` | Handles AI logic with pre-scripted branching |
| `StateTracker` | Stores user answers and conversation state |
| `RecommendationPanel` | Displays final personalized content |
| `LeadCaptureForm` | Form to collect email/name post-assessment |
| `PDFGenerator` | (Optional) Creates downloadable AI Starter Kit |
| `CRMExporter` | Sends captured data to webhook/console |
| `WelcomeModal` | First-time user orientation message |

---

## 🧪 Simulated Demo Mode

- No authentication or backend required
- All agent responses powered by static logic or Lyzr Studio with synthetic personas
- Persona paths to include:
  - AI Beginner Marketer
  - Scaling CTO
  - Curious Product Manager
- Can replay or switch persona via dropdown (for demo purposes)

---

## 📈 Data Capture & Telemetry (optional)
- Record key events like:
  - Chat start / end
  - Question drop-offs
  - Email collected
  - CTA click-throughs
- Enable session replay (e.g. PostHog integration)
- Output final user profile as a JSON object to browser console or Supabase for testing

---

## 🧠 Agent Flow Logic

> Built using Lyzr Studio, logic is modular and customizable for future verticals or personas

1. Greet user and set context
2. Ask for AI maturity level
3. Ask for role/persona
4. Ask for interest areas (HR, Marketing, Legal, etc.)
5. Recommend resources
6. Offer to email results
7. Ask if they want to schedule time with an expert
8. Output lead data

---

## 📦 Recommended Stack

| Layer | Tech |
|-------|------|
| Front-End | Bolt.new (React-based) |
| Agent Logic | Lyzr Studio |
| Storage | Supabase or Local State |
| Optional CRM | HubSpot, Salesforce, Webhook |
| Optional Analytics | Segment, PostHog |

---

## ✅ Success Criteria

- 80%+ completion rate of chat flow
- 40%+ of users provide an email or schedule a call
- Easy to extend with new personas, industries, or flows
- Showcase-quality UI for embedding on Lyzr’s homepage

---

## 🚧 Future Enhancements

- Multi-language support (EN/ES)
- Memory-enabled experiences (“Welcome back, Jeremy!”)
- Admin dashboard for conversation analytics and lead summaries
- Dynamic content updates from Notion or CMS